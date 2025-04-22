import Student from "@/entities/student";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ui/Table/column-header";
import { capitalFirstLetter } from "@/utils";
import { DataTableColumnFilter } from "../ui/Table/filter-header";

export const columns: ColumnDef<Student>[] = [
  {
    accessorFn: (row) => `${row.last_name}${row.suffix && ","} ${row.suffix}`,
    id: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "middle_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Middle Name" />
    ),
  },
  {
    accessorFn: (row) => `${capitalFirstLetter(row.gender)}`,
    id: "gender",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Gender"
        options={["Male", "Female"]}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorFn: (row) => `${new Date(row.birthdate).toLocaleDateString()}`,
    id: "birthdate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Birthdate" />
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
];
