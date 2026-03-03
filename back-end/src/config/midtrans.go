package config

import "strings"

const (
	midtransSandboxBaseURL    = "https://api.sandbox.midtrans.com"
	midtransProductionBaseURL = "https://api.midtrans.com"
)

type MidtransConfig struct {
	BaseURL   string
	ClientKey string
	ServerKey string
}

func BuildMidtransConfig() MidtransConfig {
	baseURL := GetEnv("MIDTRANS_BASE_URL")
	if baseURL == "" {
		baseURL = defaultMidtransBaseURL()
	}

	return MidtransConfig{
		BaseURL:   baseURL,
		ClientKey: GetEnv("MIDTRANS_CLIENT_KEY"),
		ServerKey: GetEnv("MIDTRANS_SERVER_KEY"),
	}
}

func (c MidtransConfig) IsConfigured() bool {
	return c.ClientKey != "" && c.ServerKey != ""
}

func defaultMidtransBaseURL() string {
	env := strings.ToLower(GetEnv("APP_ENV"))
	switch env {
	case "prod", "production":
		return midtransProductionBaseURL
	default:
		return midtransSandboxBaseURL
	}
}
