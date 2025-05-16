import { DataTableColumnHeader } from "@/components/Table/Columns/column-header";
import { DataTableColumnFilter } from "@/components/Table/Columns/filter-header";
import { Badge } from "@/components/ui/badge";
import { EnrollmentTable } from "@/types/enrollment";
import {
  capitalFirstLetter,
  displayDiscounts,
  formatToCurrency,
} from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

export const EnrollmentColumns = (
  enrollments: EnrollmentTable[]
): ColumnDef<EnrollmentTable>[] => [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: false,
  },
  {
    accessorFn: (row) => capitalFirstLetter(row.type),
    id: "type",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Type"
        options={distinctOptions(enrollments, "type")}
      />
    ),
    cell: ({ getValue }) => (
      <Badge
        className={clsx("uppercase w-1/2 h-full", {
          "bg-green-400": getValue() === "New",
          "bg-blue-400": getValue() === "Old",
        })}
      >
        {getValue<string>()}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorFn: (row) => capitalFirstLetter(row.gender),
    id: "gender",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Gender"
        options={distinctOptions(enrollments, "gender")}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorFn: (row) => capitalFirstLetter(row.grade_level),
    id: "grade_level",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Grade Level"
        options={distinctGradeLevelOptions(enrollments)}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "school_year",
    header: "School Year",
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
          ...distinctOptions(enrollments, "discount_types").map((discount) =>
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
  },
  {
    accessorFn: (row) => formatToCurrency(row.total_amount),
    header: "Total Amount",
  },
  {
    accessorFn: (row) => formatToCurrency(row.remaining_amount),
    header: "Balance",
  },
  {
    accessorFn: (row) => row.payment_status,
    id: "payment_status",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Status"
        options={distinctOptions(enrollments, "payment_status")}
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
  },
];

const distinctOptions = (
  enrollments: EnrollmentTable[],
  key: keyof EnrollmentTable
) => {
  const values = enrollments.flatMap((enrollment) => {
    const value = enrollment[key];
    return Array.isArray(value) ? value : [capitalFirstLetter(value)];
  });

  return Array.from(new Set(values));
};

const distinctGradeLevelOptions = (
  enrollments: EnrollmentTable[]
): string[] => {
  const predefinedOrder = [
    "Nursery-1",
    "Nursery-2",
    "Kinder-1",
    "Kinder-2",
    ...Array.from({ length: 6 }, (_, i) => `Grade-${i + 1}`), // Grade 1 to 6
  ];

  const values = enrollments
    .map((enrollment) => capitalFirstLetter(enrollment.grade_level))
    .filter((value) => predefinedOrder.includes(value)); // Filter valid options

  // Sort based on the predefined order
  return Array.from(new Set(values)).sort(
    (a, b) => predefinedOrder.indexOf(a) - predefinedOrder.indexOf(b)
  );
};
