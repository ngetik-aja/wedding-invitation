package customer

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

var (
	ErrPublicInvitationNotFound = errors.New("public invitation not found")
)

type PublicInvitationService struct {
	InvitationRepo *repository.InvitationRepository
	RsvpRepo       *repository.RsvpRepository
	WishRepo       *repository.WishRepository
}

type CreateRsvpInput struct {
	CustomerID  string
	Slug        string
	GuestName   string
	Attendance  string
	GuestsCount int
	Message     string
}

type CreateRsvpResult struct {
	ID          string
	GuestName   string
	Attendance  string
	GuestsCount int
	Message     string
	CreatedAt   time.Time
}

type CreateWishInput struct {
	CustomerID string
	Slug       string
	GuestName  string
	Message    string
}

type CreateWishResult struct {
	ID        string
	GuestName string
	Message   string
	CreatedAt time.Time
}

type ListWishesInput struct {
	CustomerID string
	Slug       string
	Limit      int
}

func (s *PublicInvitationService) CreateRsvp(ctx context.Context, input CreateRsvpInput) (CreateRsvpResult, error) {
	invitation, ok, err := s.InvitationRepo.FindPublishedByCustomerAndSlug(ctx, strings.TrimSpace(input.CustomerID), strings.TrimSpace(input.Slug))
	if err != nil {
		return CreateRsvpResult{}, err
	}
	if !ok {
		return CreateRsvpResult{}, ErrPublicInvitationNotFound
	}

	attendance := normalizeAttendance(input.Attendance)
	guestsCount := input.GuestsCount
	if guestsCount <= 0 {
		guestsCount = 1
	}

	rsvp, err := s.RsvpRepo.Create(ctx, repository.CreateRsvpInput{
		InvitationID: invitation.ID,
		GuestName:    strings.TrimSpace(input.GuestName),
		Attendance:   attendance,
		GuestsCount:  guestsCount,
		Message:      strings.TrimSpace(input.Message),
	})
	if err != nil {
		return CreateRsvpResult{}, err
	}

	message := strings.TrimSpace(input.Message)
	if message != "" {
		_, err = s.WishRepo.Create(ctx, repository.CreateWishInput{
			InvitationID: invitation.ID,
			GuestName:    strings.TrimSpace(input.GuestName),
			Message:      message,
		})
		if err != nil {
			return CreateRsvpResult{}, err
		}
	}

	return CreateRsvpResult{
		ID:          rsvp.ID,
		GuestName:   rsvp.GuestName,
		Attendance:  rsvp.Attendance,
		GuestsCount: rsvp.GuestsCount,
		Message:     rsvp.Message,
		CreatedAt:   rsvp.CreatedAt,
	}, nil
}

func (s *PublicInvitationService) CreateWish(ctx context.Context, input CreateWishInput) (CreateWishResult, error) {
	invitation, ok, err := s.InvitationRepo.FindPublishedByCustomerAndSlug(ctx, strings.TrimSpace(input.CustomerID), strings.TrimSpace(input.Slug))
	if err != nil {
		return CreateWishResult{}, err
	}
	if !ok {
		return CreateWishResult{}, ErrPublicInvitationNotFound
	}

	wish, err := s.WishRepo.Create(ctx, repository.CreateWishInput{
		InvitationID: invitation.ID,
		GuestName:    strings.TrimSpace(input.GuestName),
		Message:      strings.TrimSpace(input.Message),
	})
	if err != nil {
		return CreateWishResult{}, err
	}

	return CreateWishResult{
		ID:        wish.ID,
		GuestName: wish.GuestName,
		Message:   wish.Message,
		CreatedAt: wish.CreatedAt,
	}, nil
}

func (s *PublicInvitationService) ListWishes(ctx context.Context, input ListWishesInput) ([]model.Wish, error) {
	invitation, ok, err := s.InvitationRepo.FindPublishedByCustomerAndSlug(ctx, strings.TrimSpace(input.CustomerID), strings.TrimSpace(input.Slug))
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, ErrPublicInvitationNotFound
	}

	return s.WishRepo.ListByInvitationID(ctx, invitation.ID, input.Limit)
}

func normalizeAttendance(value string) string {
	attendance := strings.TrimSpace(strings.ToLower(value))
	switch attendance {
	case "attending", "hadir":
		return "attending"
	case "not-attending", "not_attending", "decline", "declined", "tidak-hadir", "tidak_hadir":
		return "not_attending"
	default:
		return "attending"
	}
}
