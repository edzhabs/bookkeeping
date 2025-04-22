import { columns } from "@/components/Table-Columns/student-column";
import { DataTable } from "@/components/ui/Table/data-table";
import Student from "@/entities/student";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StudentDetailPage from "./StudentDetailPage";
import { DebouncedInput } from "@/components/DebouncedInput";
import useTable from "@/hooks/use-table";
import { DataTableViewOptions } from "@/components/ui/Table/column-options";

const fetchStudents = async (signal: AbortSignal, searchQuery: string) => {
  const url = new URL("http://localhost:8080/api/students");
  if (searchQuery) url.searchParams.set("search", searchQuery);
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error("response was not ok");
  return await res.json();
};

const StudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: students,
    isLoading,
    isError,
  } = useQuery<{ data: Student[] }>({
    queryKey: ["students", searchQuery],
    queryFn: async ({ signal }) => fetchStudents(signal, searchQuery),
    staleTime: 60 * 1000, // 1min
    retry: 3,
  });

  const table = useTable(columns, students?.data);
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
          value={searchQuery}
          placeholder="search name.."
          onChange={setSearchQuery}
          className="w-1/4"
        />
        {/* Visibility */}
        <DataTableViewOptions table={table} />
      </div>

      <DataTable
        table={table}
        columns={columns}
        setSelected={setSelectedStudent}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default StudentsPage;
