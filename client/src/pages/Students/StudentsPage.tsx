import { columns } from "@/components/Table-Columns/student-column";
import { DataTable } from "@/components/ui/Table/data-table";
import Student from "@/entities/student";
import { useQuery } from "@tanstack/react-query";

const fetchStudents = async (signal: AbortSignal) => {
  const res = await fetch("http://localhost:8080/api/students", { signal });
  if (!res.ok) throw new Error("response was not ok");
  return await res.json();
};

const StudentsPage = () => {
  const {
    data: students,
    isLoading,
    isError,
  } = useQuery<{ data: Student[] }>({
    queryKey: ["students"],
    queryFn: async ({ signal }) => fetchStudents(signal),
    staleTime: 60 * 1000, // 1min
    retry: 3,
  });

  return (
    <div className="container mx-auto py-2">
      <DataTable
        columns={columns}
        data={students?.data || []}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default StudentsPage;
