package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/db"
)

func main() {
	_ = godotenv.Load()

	email := strings.TrimSpace(os.Getenv("ADMIN_SEED_EMAIL"))
	password := strings.TrimSpace(os.Getenv("ADMIN_SEED_PASSWORD"))
	if email == "" {
		email = "admin@example.com"
	}
	if password == "" {
		password = "admin1234"
	}

	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("DATABASE_URL is required")
	}

	ctx := context.Background()
	pool, err := db.NewPool(ctx)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer pool.Close()

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("hash password: %v", err)
	}

	_, err = pool.Exec(ctx, `
		INSERT INTO users (email, password_hash)
		VALUES ($1, $2)
		ON CONFLICT (email) DO NOTHING
	`, strings.ToLower(email), string(hash))
	if err != nil {
		log.Fatalf("insert admin: %v", err)
	}

	fmt.Printf("seeded admin user: %s\n", strings.ToLower(email))
}
