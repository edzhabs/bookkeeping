import { DataTableColumnHeader } from "@/components/Table/Columns/column-header";
import { DataTableColumnFilter } from "@/components/Table/Columns/filter-header";
import { Badge } from "@/components/ui/badge";
import { TransactionTable } from "@/types/transactions";
import {
  capitalFirstLetter,
  displayCategories,
  formatToCurrency,
} from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

export const TransactionColumns = (
  transactions: TransactionTable[]
): ColumnDef<TransactionTable>[] => [
  {
    accessorKey: "invoice_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="O.R #" />
    ),
    id: "invoice_number",
    enableHiding: false,
    meta: {
      name: "O.R #",
    },
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    id: "full_name",
    meta: {
      name: "Name",
    },
  },
  {
    accessorFn: (row) => displayCategories(row.category),
    id: "category",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Category"
        options={distinctOptions(transactions, "category")
          .map((cat) => displayCategories([cat]))
          .filter((cat): cat is string => typeof cat === "string")}
      />
    ),
    cell: ({ getValue }) =>
      getValue<string>()
        .split(",")
        .map((item) => item.trim())
        .map((item, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="hover:bg-slate-200 cursor-default text-xs"
          >
            {item}
          </Badge>
        )),
    filterFn: (row, id, value) => {
      const mappedCategories = row.getValue<string[]>(id);
      return value.some((v: string) => mappedCategories.includes(v));
    },
    meta: {
      name: "Category",
    },
  },
  {
    accessorKey: "payment_date",
    id: "payment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ getValue }) =>
      getValue()
        ? formatDate(new Date(getValue() as string), "MM/dd/yyyy")
        : "",
    meta: {
      name: "Date",
    },
  },
  {
    accessorFn: (row) => formatToCurrency(row.amount),
    id: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Due Amount" />
    ),
    meta: {
      name: "Amount",
    },
    footer: ({ table }) => {
      // Sum the raw remaining_amount values
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + (Number(row.original.amount) || 0), 0);
      return <span className="font-semibold">{formatToCurrency(total)}</span>;
    },
  },
  {
    accessorFn: (row) => capitalFirstLetter(row.payment_method),
    id: "payment_method",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Method"
        options={distinctOptions(transactions, "payment_method")}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      name: "Method",
    },
  },
];

const distinctOptions = (
  transactions: TransactionTable[],
  key: keyof TransactionTable
) => {
  const values = transactions.flatMap((transaction) => {
    const value = transaction[key];
    return Array.isArray(value) ? value : [capitalFirstLetter(value)];
  });

  return Array.from(new Set(values));
};
