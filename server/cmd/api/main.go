package main

import (
	"time"

	"github.com/edzhabs/bookkeeping/internal/db"
	"github.com/edzhabs/bookkeeping/internal/env"
	"github.com/edzhabs/bookkeeping/internal/ratelimiter"
	"github.com/edzhabs/bookkeeping/internal/store"
	"go.uber.org/zap"
)

const version = "0.0.1"

func main() {
	// Logger
	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	cfg := config{
		addr: env.GetString("ADDR", ":8080"),
		env:  env.GetString("ENV", "development"),
		rateLimiter: ratelimiter.Config{
			RequestPerTimeFrame: env.GetInt("RATELIMITER_REQUEST_COUNT", 20),
			TimeFrame:           time.Second * 5,
			Enabled:             env.GetBool("RATE_LIMITER_ENABLED", true),
		},
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", ""),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
	}

	// DB
	db, err := db.New(
		cfg.db.addr,
		cfg.db.maxOpenConns,
		cfg.db.maxIdleConns,
		cfg.db.maxIdleTime,
	)
	if err != nil {
		logger.Fatal(err)
	}

	logger.Info("database connection pool established")

	// ratelimiter
	ratelimiter := ratelimiter.NewFixedWindowLimiter(
		cfg.rateLimiter.RequestPerTimeFrame,
		cfg.rateLimiter.TimeFrame,
	)

	store := store.New(db)

	app := &application{
		config:      cfg,
		logger:      logger,
		ratelimiter: ratelimiter,
		store:       store,
	}

	mux := app.mount()

	logger.Fatal(app.run(mux))

}
