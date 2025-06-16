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
    id: "full_name",
    enableHiding: false,
    meta: {
      name: "Name",
    },
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
    meta: {
      name: "Type",
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
    meta: {
      name: "Gender",
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
          ...distinctOptions(enrollments, "discount_types").map((discount) =>
            displayDiscounts([discount])
          ),
        ]}
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
      // Map raw discount types to display values
      const mappedDiscounts = row.getValue<string[]>(id);
      return value.some((v: string) => mappedDiscounts.includes(v));
    },
    meta: {
      name: "Discount",
    },
  },
  {
    accessorFn: (row) => formatToCurrency(row.total_tuition_amount_due),
    id: "total_tuition_amount_due",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Due Amount" />
    ),
    meta: {
      name: "Total Due Amount",
    },
    footer: ({ table }) => {
      // Sum the raw remaining_amount values
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) =>
            sum + (Number(row.original.total_tuition_amount_due) || 0),
          0
        );
      return <span className="font-semibold">{formatToCurrency(total)}</span>;
    },
  },
  {
    accessorFn: (row) => formatToCurrency(row.total_tuition_paid),
    id: "total_tuition_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Paid Amount" />
    ),
    meta: {
      name: "Total Paid Amount",
    },
    footer: ({ table }) => {
      // Sum the raw remaining_amount values
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + (Number(row.original.total_tuition_paid) || 0),
          0
        );
      return (
        <span className="font-semibold text-sky-400">
          {formatToCurrency(total)}
        </span>
      );
    },
  },
  {
    accessorFn: (row) => formatToCurrency(row.tuition_balance),
    id: "tuition_balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    meta: {
      name: "Balance",
    },
    footer: ({ table }) => {
      // Sum the raw remaining_amount values
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + (Number(row.original.tuition_balance) || 0),
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
    accessorFn: (row) => row.tuition_payment_status,
    id: "tuition_payment_status",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Status"
        options={distinctOptions(enrollments, "tuition_payment_status")}
      />
    ),
    cell: ({ getValue }) => (
      <Badge
        className={`${getStatusColor(
          (getValue() as string) || ""
        )} capitalize font-medium`}
      >
        {getValue<string>() || ""}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      const cellValue = (row.getValue(id) as string)?.toLowerCase();
      return value.some((v: string) => v.toLowerCase() === cellValue);
    },
    meta: {
      name: "Status",
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
    ...Array.from({ length: 7 }, (_, i) => `Grade-${i + 1}`), // Grade 1 to 6
  ];

  const values = enrollments
    .map((enrollment) => capitalFirstLetter(enrollment.grade_level))
    .filter((value) => predefinedOrder.includes(value)); // Filter valid options

  // Sort based on the predefined order
  return Array.from(new Set(values)).sort(
    (a, b) => predefinedOrder.indexOf(a) - predefinedOrder.indexOf(b)
  );
};

const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    case "unpaid":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "partial":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};
