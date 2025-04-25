import CONSTANTS from "@/constants/constants";
import Student from "@/entities/student";
import { fetchStudents } from "@/services/students";
import { useQuery } from "@tanstack/react-query";

const useStudents = () => {
  return useQuery<{ data: Student[] }>({
    queryKey: ["students"],
    queryFn: async ({ signal }) => fetchStudents(signal),
    staleTime: CONSTANTS.STALETIME,
    retry: CONSTANTS.RETRY,
  });
};

export default useStudents;
