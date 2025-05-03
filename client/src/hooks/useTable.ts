import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
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
  data: TData[] | undefined
) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
      state: {
        sorting,
        globalFilter,
        columnFilters,
        columnVisibility,
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
    [data, columns, sorting, columnFilters, columnVisibility, globalFilter]
  );

  const table = useReactTable<TData>(tableConfig);

  return { table, setGlobalFilter };
}

export default useTable;
