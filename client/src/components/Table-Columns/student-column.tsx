import Student from "@/entities/student";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ui/Table/column-header";

export const columns: ColumnDef<Student>[] = [
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "guardians",
    header: "Guardian name",
    cell: ({ row }) => row.original.guardians[0].name,
  },
];
