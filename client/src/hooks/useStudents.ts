import Student from "@/entities/student";
import { fetchStudents } from "@/services/students";
import { useQuery } from "@tanstack/react-query";

const useStudents = () => {
  return useQuery<{ data: Student[] }>({
    queryKey: ["students"],
    queryFn: async ({ signal }) => fetchStudents(signal),
  });
};

export default useStudents;
