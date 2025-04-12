package main

import "net/http"

func (app *application) RateLimiterMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if app.config.rateLimiter.Enabled {
			allow, retryAfter := app.ratelimiter.Allow(r.RemoteAddr)
			if !allow {
				app.rateLimitReachedResponse(w, r, retryAfter.String())
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
