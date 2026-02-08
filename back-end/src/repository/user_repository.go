package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
)

type UserRepository struct {
	DB *pgxpool.Pool
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (model.User, bool, error) {
	var user model.User
	row := r.DB.QueryRow(ctx, `
		SELECT id, email, password_hash, created_at
		FROM users
		WHERE email = $1
		LIMIT 1
	`, email)
	if err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt); err != nil {
		return model.User{}, false, nil
	}
	return user, true, nil
}

func (r *UserRepository) FindByID(ctx context.Context, userID string) (model.User, bool, error) {
	var user model.User
	row := r.DB.QueryRow(ctx, `
		SELECT id, email, password_hash, created_at
		FROM users
		WHERE id = $1
		LIMIT 1
	`, userID)
	if err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt); err != nil {
		return model.User{}, false, nil
	}
	return user, true, nil
}

func (r *UserRepository) SaveRefreshToken(ctx context.Context, token model.UserRefreshToken) error {
	_, err := r.DB.Exec(ctx, `
		INSERT INTO user_refresh_tokens (user_id, token_hash, expires_at, user_agent, ip_address)
		VALUES ($1, $2, $3, $4, $5)
	`, token.UserID, token.TokenHash, token.ExpiresAt, token.UserAgent, token.IPAddress)
	return err
}

func (r *UserRepository) FindRefreshToken(ctx context.Context, tokenHash string) (model.UserRefreshToken, bool, error) {
	var token model.UserRefreshToken
	row := r.DB.QueryRow(ctx, `
		SELECT id, user_id, token_hash, expires_at, revoked_at
		FROM user_refresh_tokens
		WHERE token_hash = $1
		LIMIT 1
	`, tokenHash)
	if err := row.Scan(&token.ID, &token.UserID, &token.TokenHash, &token.ExpiresAt, &token.RevokedAt); err != nil {
		return model.UserRefreshToken{}, false, nil
	}
	return token, true, nil
}

func (r *UserRepository) RevokeRefreshToken(ctx context.Context, tokenHash string) error {
	_, err := r.DB.Exec(ctx, `
		UPDATE user_refresh_tokens
		SET revoked_at = now()
		WHERE token_hash = $1 AND revoked_at IS NULL
	`, tokenHash)
	return err
}

func (r *UserRepository) RevokeAllForUser(ctx context.Context, userID string) error {
	_, err := r.DB.Exec(ctx, `
		UPDATE user_refresh_tokens
		SET revoked_at = now()
		WHERE user_id = $1 AND revoked_at IS NULL
	`, userID)
	return err
}

func (r *UserRepository) CleanupExpired(ctx context.Context) error {
	_, err := r.DB.Exec(ctx, `
		DELETE FROM user_refresh_tokens
		WHERE expires_at < now() OR revoked_at IS NOT NULL
	`)
	return err
}

func (r *UserRepository) TouchRefreshToken(ctx context.Context, tokenHash string, expiresAt time.Time) error {
	_, err := r.DB.Exec(ctx, `
		UPDATE user_refresh_tokens
		SET expires_at = $2
		WHERE token_hash = $1
	`, tokenHash, expiresAt)
	return err
}
