import CONSTANTS from "@/constants/constants";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ui/Table/column-header";
import { DataTableColumnFilter } from "../ui/Table/filter-header";

export interface Tuition {
  invoiceNo: string;
  studentName: string;
  gradeLevel: string;
  paymentDate: Date;
  amount: number;
  paymentType: string;
  paymentMethod: string;
}

export const TuitionColumns: ColumnDef<Tuition>[] = [
  {
    accessorKey: "invoiceNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice No." />
    ),
    enableGlobalFilter: true,
  },
  {
    accessorFn: (row) => `${row.studentName}`,
    id: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "gradeLevel",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Grade Level"
        options={CONSTANTS.GRADELEVEL}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Method"
        options={CONSTANTS.PAYMENTMETHOD}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableGlobalFilter: true,
  },
];
