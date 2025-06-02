import CONSTANTS from "@/constants/constants";
import { fetchStudentsDropdown } from "@/services/students";
import { StudentDropdown } from "@/types/student";
import { useQuery } from "@tanstack/react-query";

const useStudentsQuery = () => {
  return useQuery<{
    data: StudentDropdown[] | undefined;
  }>({
    queryKey: [CONSTANTS.QUERYKEY.STUDENTS],
    queryFn: fetchStudentsDropdown,
  });
};

export default useStudentsQuery;
