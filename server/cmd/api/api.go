package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/edzhabs/bookkeeping/internal/env"
	"github.com/edzhabs/bookkeeping/internal/ratelimiter"
	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.uber.org/zap"
)

type application struct {
	config      config
	logger      *zap.SugaredLogger
	ratelimiter ratelimiter.Limiter
	store       store.Storage
}

type config struct {
	addr        string
	env         string
	db          dbConfig
	rateLimiter ratelimiter.Config
}

type dbConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{env.GetString("CORS_ALLOWED_ORIGIN", "http://localhost:5173")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	if app.config.rateLimiter.Enabled {
		r.Use(app.RateLimiterMiddleware)
	}

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	r.Route("/api", func(r chi.Router) {
		r.Get("/health", app.healthCheckHandler)

		r.Route("/enrollments", func(r chi.Router) {
			r.Get("/", app.getEnrollmentsHandler)
			r.Post("/new", app.createNewEnrollmentHandler)
			r.Post("/existing", app.createOldEnrollmentHandler)

			r.Route("/{enrollmentID}", func(r chi.Router) {
				r.Use(app.enrollmentIDfromURLContextMiddleware)

				r.With(app.enrollmentContextMiddleware).Get("/", app.getEnrollmentHandler)
				r.With(app.editEnrollmentContextMiddleware).Get("/edit", app.getEditEnrollmentHandler)
				r.Patch("/", app.updateEnrollmentHandler)
				r.Delete("/", app.deleteEnrollmentHandler)
			})
		})

		r.Route("/tuitions", func(r chi.Router) {
			r.Get("/", app.getTuitionsHandler)

			r.Route("/{enrollmentID}", func(r chi.Router) {
				r.Use(app.enrollmentIDfromURLContextMiddleware)
				r.Get("/", app.getTuitionHandler)
			})
		})

		r.Route("/students", func(r chi.Router) {
			r.Get("/dropdown", app.getStudentsDropdownHandler)
			r.Post("/", app.createStudentHandler)
		})
	})

	return r
}

func (app *application) run(mux http.Handler) error {
	srv := &http.Server{
		Addr:         app.config.addr,
		Handler:      mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	shutdown := make(chan error)

	go func() {
		quit := make(chan os.Signal, 1)

		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		app.logger.Infow("signal caught", "signal", s.String())

		shutdown <- srv.Shutdown(ctx)
	}()

	app.logger.Infow("server started", "addr", app.config.addr, "env", app.config.env)

	err := srv.ListenAndServe()
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	err = <-shutdown
	if err != nil {
		return err
	}

	app.logger.Infow("server has stopped", "addr", app.config.addr, "env", app.config.env)

	return nil
}
