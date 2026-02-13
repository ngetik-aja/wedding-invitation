package query

import "time"

type InvitationListFilters struct {
	CustomerID string
	Query      string
	Status     string
	DateFrom   *time.Time
	DateTo     *time.Time
	Limit      int
	Offset     int
}
