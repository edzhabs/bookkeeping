import CONSTANTS from "@/constants/constants";
import { fetchEnrollmentDetails } from "@/services/enrollments";
import { StudentEnrollmentDetails } from "@/types/enrollment";
import { useQuery } from "@tanstack/react-query";

const useEnrollmentDetails = (paramsID: string | undefined) => {
  return useQuery<{
    data: StudentEnrollmentDetails;
  }>({
    queryKey: [CONSTANTS.QUERYKEY.ENROLLMENT, paramsID],
    queryFn: () => fetchEnrollmentDetails(paramsID),
  });
};

export default useEnrollmentDetails;
