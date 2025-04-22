package store

import (
	"net/http"
	"strconv"
)

type PaginatedQuery struct {
	Limit  int    `json:"limit" validate:"gte=1,lte=10"`
	Offset int    `json:"offset" validate:"gte=0"`
	Search string `json:"search" validate:"max=100"`
}

func (fq PaginatedQuery) Parse(r *http.Request) (PaginatedQuery, error) {
	qs := r.URL.Query()

	limit := qs.Get("limit")
	if limit != "" {
		limitInt, err := strconv.Atoi(limit)
		if err != nil {
			return fq, err
		}

		fq.Limit = limitInt
	}

	offset := qs.Get("offset")
	if offset != "" {
		offsetInt, err := strconv.Atoi(offset)
		if err != nil {
			return fq, err
		}

		fq.Offset = offsetInt
	}

	search := qs.Get("search")
	if search != "" {
		fq.Search = search
	}

	return fq, nil
}
