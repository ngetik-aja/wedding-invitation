package model

import "time"

type Customer struct {
	ID           string
	FullName     string
	Email        string
	PasswordHash string
	Domain       string
	Status       string
	CreatedAt    time.Time
}
