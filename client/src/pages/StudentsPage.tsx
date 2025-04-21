import { columns } from "@/components/Table-Columns/student-column";
import { DataTable } from "@/components/ui/Table/data-table";
import Student from "@/entities/student";
import { useQuery } from "@tanstack/react-query";

const fetchStudents = async (signal: AbortSignal) => {
  const res = await fetch("../../test_data/students.json", { signal });
  if (!res.ok) throw new Error("response was not ok");
  return res.json();
};

const StudentsPage = () => {
  const { data: students } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async ({ signal }) => fetchStudents(signal),
  });

  return (
    <div className="container mx-auto py-2">
      <DataTable columns={columns} data={students || []} />
    </div>
  );
};

export default StudentsPage;
