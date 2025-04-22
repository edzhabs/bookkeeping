package main

import (
	"log"

	"github.com/edzhabs/bookkeeping/internal/db"
	"github.com/edzhabs/bookkeeping/internal/env"
	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env, err:", err)
	}

	addr := env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/bookkeeping?sslmode=disable")
	conn, err := db.New(addr, 3, 3, "15m")
	if err != nil {
		log.Fatal(err)
	}

	defer conn.Close()

	store := store.NewStorage(conn)
	db.Seed(store, conn)
}
