package content

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
)

// Normalize returns default invitation content if input is empty.
func Normalize(input []byte, fullName string) []byte {
	if len(bytes.TrimSpace(input)) > 0 {
		return input
	}

	fullName = strings.TrimSpace(fullName)
	firstName := fullName
	if parts := strings.Fields(fullName); len(parts) > 0 {
		firstName = parts[0]
	}

	payload := map[string]any{
		"couple": map[string]any{
			"groomName":     firstName,
			"groomFullName": fullName,
		},
	}
	encoded, err := json.Marshal(payload)
	if err != nil {
		return []byte("{}")
	}
	return encoded
}

// Decode parses invitation content JSON into a map.
func Decode(raw []byte) (map[string]any, error) {
	if len(raw) == 0 {
		return map[string]any{}, nil
	}
	var out map[string]any
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, fmt.Errorf("invalid invitation content: %w", err)
	}
	return out, nil
}

// IsPaid reports whether a customer status counts as paid.
func IsPaid(status string) bool {
	return strings.ToLower(strings.TrimSpace(status)) == "paid"
}
