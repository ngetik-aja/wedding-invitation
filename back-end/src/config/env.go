package config

import (
	"fmt"
	"os"
	"strings"
)

func GetEnv(key string) string {
	return strings.TrimSpace(os.Getenv(key))
}

func RequireEnv(key string) (string, error) {
	value := GetEnv(key)
	if value == "" {
		return "", fmt.Errorf("%s is required", key)
	}
	return value, nil
}
