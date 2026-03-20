package slug

import (
	"context"
	"crypto/rand"
	"fmt"
	"regexp"
	"strings"
)

var slugRe = regexp.MustCompile(`[^a-z0-9-]+`)

func Slugify(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	value = strings.ReplaceAll(value, " ", "-")
	value = slugRe.ReplaceAllString(value, "-")
	value = strings.Trim(value, "-")
	for strings.Contains(value, "--") {
		value = strings.ReplaceAll(value, "--", "-")
	}
	return value
}

// GenerateID returns a UUID v4 string.
func GenerateID() (string, error) {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		return "", err
	}
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:16]), nil
}

// ShortID returns the first 6 hex chars of a UUID (dashes removed).
func ShortID(id string) string {
	clean := strings.ReplaceAll(id, "-", "")
	if len(clean) >= 6 {
		return clean[:6]
	}
	return clean
}

func EnsureUnique(ctx context.Context, base string, exists func(context.Context, string) (bool, error)) (string, error) {
	candidate := base
	if candidate == "" {
		candidate = "undangan"
	}
	base = candidate

	for i := 0; i < 1000; i++ {
		check := candidate
		if i > 0 {
			check = fmt.Sprintf("%s-%d", base, i+1)
		}
		ok, err := exists(ctx, check)
		if err != nil {
			return "", err
		}
		if !ok {
			return check, nil
		}
	}
	return "", fmt.Errorf("unable to generate unique slug")
}
