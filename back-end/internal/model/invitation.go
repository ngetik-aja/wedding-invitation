package model

import "time"

type Invitation struct {
	ID          string
	CustomerID  string
	Slug        string
	Title       string
	SearchName  string
	EventDate   *time.Time
	ThemeKey    string
	IsPublished bool
	Content     []byte
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
