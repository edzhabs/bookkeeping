package main

import (
	"net/http"

	"github.com/edzhabs/bookkeeping/internal/utils"
)

func (app *application) getTransactionsHandler(w http.ResponseWriter, r *http.Request) {
	transactions, err := app.store.Transactions.GetAll(r.Context())
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, transactions); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
