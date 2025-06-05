package utils

import "encoding/json"

func ScanJSON[T any](data []byte, into *T) error {
	return json.Unmarshal(data, into)
}
