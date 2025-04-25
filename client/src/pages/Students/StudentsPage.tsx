import { DebouncedInput } from "@/components/DebouncedInput";
import { StudentColumns } from "@/components/Table-Columns/student-column";
import { DataTableViewOptions } from "@/components/ui/Table/column-options";
import { DataTable } from "@/components/ui/Table/data-table";
import Student from "@/entities/student";
import useStudents from "@/hooks/useStudents";
import useTable from "@/hooks/useTable";
import { useState } from "react";
import StudentDetailPage from "./StudentDetailPage";

const StudentsPage = () => {
  const { data: students, isLoading, isError } = useStudents();

  const { table, setGlobalFilter } = useTable(StudentColumns, students?.data);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>();

  if (selectedStudent)
    return (
      <StudentDetailPage
        data={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />
    );

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
        setSelected={setSelectedStudent}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default StudentsPage;
