package shared

import (
	"context"
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

func EnsureUniqueSlug(ctx context.Context, base string, exists func(context.Context, string) (bool, error)) (string, error) {
	candidate := base
	if candidate == "" {
		candidate = "undangan"
	}
	base = candidate

	for i := 0; i < 1000; i += 1 {
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
