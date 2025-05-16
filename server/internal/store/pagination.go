package store

import (
	"net/http"
	"strconv"
)

type PaginatedQuery struct {
	Limit      int    `json:"limit" validate:"gte=1,lte=10"`
	Offset     int    `json:"offset" validate:"gte=0"`
	SortBy     string `json:"sortBy" validate:"max=100"`
	SortDir    string `json:"sort" validate:"sortfq"`
	Search     string `json:"search" validate:"max=100"`
	SchoolYear string `json:"school_year" validate:"max=100"`
	GradeLevel string `json:"gradeLevel" validate:"max=100"`
	Discount   string `json:"discount" validate:"max=100"`
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

	sortBy := qs.Get("sortBy")
	if sortBy != "" {
		fq.SortBy = sortBy
	}

	sortDir := qs.Get("sortDir")
	if sortDir != "" {
		fq.SortDir = sortDir
	}

	search := qs.Get("search")
	if search != "" {
		fq.Search = search
	}

	discount := qs.Get("discount")
	if discount != "" {
		fq.Discount = discount
	}

	schoolYear := qs.Get("schoolYear")
	if schoolYear != "" {
		fq.SchoolYear = schoolYear
	}

	gradeLevel := qs.Get("gradeLevel")
	if gradeLevel != "" {
		fq.GradeLevel = gradeLevel
	}

	return fq, nil
}
