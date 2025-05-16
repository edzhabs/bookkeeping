import { create } from "zustand";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

interface TableState {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  setGlobalFilters: (globalFilter: string) => void;
  setColumnFilters: (columns: ColumnFiltersState) => void;
  setSorting: (sort: SortingState) => void;
  setColumnVisibility: (visibility: VisibilityState) => void;
  setPagination: (pagination: PaginationState) => void;
}

export const useTableStore = create<TableState>((set) => ({
  globalFilter: "",
  columnFilters: [],
  sorting: [],
  columnVisibility: {
    full_name: true,
    type: false,
    gender: false,
    grade_level: true,
    school_year: true,
    discount: false,
    total_amount: true,
    remaining_amount: true,
    payment_status: true,
  },
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  setGlobalFilters: (globalFilter) => set({ globalFilter }),
  setColumnFilters: (columns) => set({ columnFilters: columns }),
  setSorting: (sorting) => set({ sorting }),
  setColumnVisibility: (visibility) => set({ columnVisibility: visibility }),
  setPagination: (pagination) => set({ pagination }),
}));
