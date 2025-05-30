import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

function useTable<TData>(
  columns: ColumnDef<TData, unknown>[],
  visibleColumns: Record<string, boolean>,
  data: TData[] | undefined
) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(visibleColumns);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableConfig = useMemo(
    () => ({
      data: data || [],
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      autoResetPageIndex: false,
      state: {
        sorting,
        globalFilter,
        columnFilters,
        columnVisibility,
        pagination,
      },
      globalFilterFn: (
        row: Row<TData>,
        columnIds: string[] | string,
        filterValue: string
      ) => {
        // Ensure columnIds is an array or handle single column ID
        const ids = Array.isArray(columnIds) ? columnIds : [columnIds];

        // Use rankItem from match-sorter-utils for fuzzy search
        return rankItem(
          ids.map((id) => row.getValue(id)).join(" "),
          filterValue
        ).passed;
      },
    }),
    [
      data,
      columns,
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    ]
  );

  const table = useReactTable<TData>(tableConfig);

  return { table, setGlobalFilter };
}

export default useTable;
