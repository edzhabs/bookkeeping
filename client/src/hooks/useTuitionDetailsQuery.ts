import CONSTANTS from "@/constants/constants";
import { fetchTuitionDetails } from "@/services/tuitions";
import { TuitionDetails } from "@/types/tuition";
import { useQuery } from "@tanstack/react-query";

const useTuitionDetailsQuery = (paramsID: string | undefined) =>
  useQuery<{
    data: TuitionDetails | undefined;
  }>({
    queryKey: [CONSTANTS.QUERYKEY.TUITIONS, paramsID],
    queryFn: () => fetchTuitionDetails(paramsID),
  });

export default useTuitionDetailsQuery;
