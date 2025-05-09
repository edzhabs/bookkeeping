import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

function useTable<TData>(
  columns: ColumnDef<TData, unknown>[],
  data: TData[] | undefined
) {
  const [sorting, setSorting] = useState<SortingState>([]);
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
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
      },
    }),
    [data, columns, sorting, columnFilters, columnVisibility]
  );

  const table = useReactTable(tableConfig);

  return table;
}

export default useTable;
