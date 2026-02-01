package model

import "time"

type Customer struct {
	ID        string
	FullName  string
	Email     string
	Domain    string
	Status    string
	CreatedAt time.Time
}
