import { DataTableColumnHeader } from "@/components/Table/Columns/column-header";
import { DataTableColumnFilter } from "@/components/Table/Columns/filter-header";
import { Badge } from "@/components/ui/badge";
import { TuitionsTable } from "@/types/tuition";
import {
  capitalFirstLetter,
  displayDiscounts,
  formatToCurrency,
} from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

export const TuitionColumns = (
  tuitions: TuitionsTable[]
): ColumnDef<TuitionsTable>[] => [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: false,
    meta: {
      name: "Name",
    },
  },
  {
    accessorFn: (row) => capitalFirstLetter(row.grade_level),
    id: "grade_level",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Grade Level"
        options={distinctGradeLevelOptions(tuitions)}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      name: "Grade Level",
    },
  },
  {
    accessorKey: "school_year",
    id: "school_year",
    header: "School Year",
    meta: {
      name: "School Year",
    },
  },
  {
    accessorFn: (row) => displayDiscounts(row.discount_types),
    id: "discount",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Discount"
        options={[
          "None",
          ...distinctOptions(tuitions, "discount_types").map((discount) =>
            displayDiscounts([discount])
          ),
        ]}
      />
    ),
    filterFn: (row, id, value) => {
      // Map raw discount types to display values
      const mappedDiscounts = row.getValue<string[]>(id);
      return value.some((v: string) => mappedDiscounts.includes(v));
    },
    meta: {
      name: "Discount",
    },
  },
  {
    accessorFn: (row) => formatToCurrency(row.total_amount),
    id: "total_amount",
    header: "Total Amount",
    meta: {
      name: "Total Amount",
    },
    footer: ({ table }) => {
      // Sum the raw remaining_amount values
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + (Number(row.original.total_amount) || 0),
          0
        );
      return (
        <span className="font-semibold text-emerald-500">
          {formatToCurrency(total)}
        </span>
      );
    },
  },
  {
    accessorFn: (row) => formatToCurrency(row.remaining_amount),
    id: "remaining_amount",
    header: "Balance",
    meta: {
      name: "Balance",
    },
    footer: ({ table }) => {
      // Sum the raw remaining_amount values
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + (Number(row.original.remaining_amount) || 0),
          0
        );
      return (
        <span className="font-semibold text-rose-500">
          {formatToCurrency(total)}
        </span>
      );
    },
  },
  {
    accessorFn: (row) => row.payment_status,
    id: "payment_status",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Status"
        options={distinctOptions(tuitions, "payment_status")}
      />
    ),
    cell: ({ getValue }) => (
      <Badge
        className={clsx("capitalize font-medium")}
        variant={
          getValue() === "Paid"
            ? "success"
            : getValue() === "Partial"
            ? "warning"
            : "destructive"
        }
      >
        {getValue<string>()}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      name: "Status",
    },
  },
];

const distinctOptions = (
  tuitions: TuitionsTable[],
  key: keyof TuitionsTable
) => {
  const values = tuitions.flatMap((enrollment) => {
    const value = enrollment[key];
    return Array.isArray(value) ? value : [capitalFirstLetter(value)];
  });

  return Array.from(new Set(values));
};

const distinctGradeLevelOptions = (tuitions: TuitionsTable[]): string[] => {
  const predefinedOrder = [
    "Nursery-1",
    "Nursery-2",
    "Kinder-1",
    "Kinder-2",
    ...Array.from({ length: 7 }, (_, i) => `Grade-${i + 1}`), // Grade 1 to 6
  ];

  const values = tuitions
    .map((enrollment) => capitalFirstLetter(enrollment.grade_level))
    .filter((value) => predefinedOrder.includes(value)); // Filter valid options

  // Sort based on the predefined order
  return Array.from(new Set(values)).sort(
    (a, b) => predefinedOrder.indexOf(a) - predefinedOrder.indexOf(b)
  );
};
