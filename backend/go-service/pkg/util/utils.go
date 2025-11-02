package util

import (
	"strings"
)

func BuildCode(name string) string {
	return strings.ToUpper(strings.ReplaceAll(name, " ", ""))
}

func BuildAlias(name string) string {
	return strings.ToLower(strings.ReplaceAll(name, " ", "-"))
}

// StringPtr returns a pointer to the given string
func StringPtr(s string) *string {
	return &s
}

// TruncateString truncates a string to maxLen characters and adds "..." if truncated
func TruncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}
