import CONSTANTS from "@/constants/constants";
import { fetchTuitionsDropdown } from "@/services/tuitions";
import { TuitionDropdown } from "@/types/tuition";
import { useQuery } from "@tanstack/react-query";

const useTuitionDropdownQuery = () => {
  return useQuery<{
    data: TuitionDropdown[] | undefined;
  }>({
    queryKey: [CONSTANTS.QUERYKEY.TUITIONDROPDOWN],
    queryFn: fetchTuitionsDropdown,
  });
};

export default useTuitionDropdownQuery;
