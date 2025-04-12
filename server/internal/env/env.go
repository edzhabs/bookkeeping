package env

import (
	"os"
	"strconv"
)

func GetString(val, fallback string) string {
	val, ok := os.LookupEnv(val)
	if val == "" || !ok {
		return fallback
	}

	return val
}

func GetInt(val string, fallback int) int {
	val, ok := os.LookupEnv(val)
	if !ok {
		return fallback
	}

	valInt, err := strconv.Atoi(val)
	if err != nil {
		return fallback
	}

	return valInt
}

func GetBool(val string, fallback bool) bool {
	val, ok := os.LookupEnv(val)
	if !ok {
		return fallback
	}

	valBool, err := strconv.ParseBool(val)
	if err != nil {
		return fallback
	}

	return valBool
}
