import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/Table/Columns/column-header";
import { capitalFirstLetter } from "@/utils";
import { DataTableColumnFilter } from "@/components/Table/Columns/filter-header";
import { Enrollment } from "@/types/enrollment";

export const EnrollmentColumns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorFn: (row) => row.gender,
    id: "gender",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        className="capitalize"
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
    accessorKey: "school_year",
    header: "School Year",
  },
  {
    accessorFn: (row) => `${capitalFirstLetter(row.discount_type)}`,
    id: "discount",
    header: ({ column }) => (
      <DataTableColumnFilter
        column={column}
        title="Discount"
        options={["None", "Scholar", "Sibling"]}
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
