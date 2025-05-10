import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { DataTablePagination } from "./Table/Columns/pagination";
import clsx from "clsx";

interface DataTableProps<TData extends { id: string }> {
  table: ReactTable<TData>;
  handleClick: (id: string) => void;
}

export function DataTable<TData extends { id: string }>({
  table,
  handleClick,
}: DataTableProps<TData>) {
  return (
    <>
      <div className="rounded-md border shadow-sm w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-slate-100 border-b border-slate-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-slate-50 font-semibold text-slate-700"
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`
                    ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} 
                    cursor-pointer hover:bg-slate-100 transition-colors
                    border-b border-slate-200 last:border-0
                  `}
                  onClick={() => handleClick(row.original.id)}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={clsx("py-4", {
                        "font-medium hover:underline text-left": index === 0,
                      })}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {table.getRowModel().rows?.length > 0 && (
        <DataTablePagination table={table} />
      )}
    </>
  );
}
