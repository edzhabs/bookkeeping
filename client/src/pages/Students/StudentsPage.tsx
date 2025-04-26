import { DebouncedInput } from "@/components/DebouncedInput";
import { StudentColumns } from "@/components/Table-Columns/student-column";
import { DataTableViewOptions } from "@/components/ui/Table/column-options";
import { DataTable } from "@/components/ui/Table/data-table";
import { NAVTITLE } from "@/constants/side-menu";
import { HeaderContext } from "@/context/headerContext";
import useStudents from "@/hooks/useStudents";
import useTable from "@/hooks/useTable";
import { useContext, useEffect } from "react";

const StudentsPage = () => {
  const { setHeaderTitle } = useContext(HeaderContext);
  const { data: students, isLoading, isError } = useStudents();
  const { table, setGlobalFilter } = useTable(StudentColumns, students?.data);

  useEffect(() => {
    setHeaderTitle(NAVTITLE.STUDENTS.title);
  }, [setHeaderTitle]);

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center pb-2">
        <DebouncedInput
          value={table.getState().globalFilter || ""}
          placeholder="search name.."
          onChange={(value) => setGlobalFilter(value)}
          className="w-1/4"
        />
        {/* Visibility */}
        <DataTableViewOptions table={table} />
      </div>

      <DataTable
        table={table}
        columns={StudentColumns}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default StudentsPage;
