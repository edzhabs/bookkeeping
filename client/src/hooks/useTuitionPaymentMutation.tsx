import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import CONSTANTS from "@/constants/constants";
import { useLoading } from "@/context/loading-prover";
import { logActivity } from "@/lib/activity-logger";
import { payTuition } from "@/services/tuitions";
import { TuitionPaymentBody } from "@/types/tuition";
import { formatToCurrency } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useTuitionPaymentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: (body: TuitionPaymentBody) => payTuition(body),
    onMutate: () => {
      showLoading("Processing tuition payment...");
    },
    onSuccess: (_, resp) => {
      queryClient.invalidateQueries({
        queryKey: [CONSTANTS.QUERYKEY.ENROLLMENT],
      });
      queryClient.invalidateQueries({
        queryKey: [CONSTANTS.QUERYKEY.TUITIONDROPDOWN],
      });

      logActivity({
        action: "Created",
        entityType: "Tuition",
        entityId: resp.enrollment_id || "",
        details: `Created tuition payment ${resp.enrollment_id}`,
      });

      navigate("/enrollment/" + resp.enrollment_id);

      toast.success(
        <>
          <div className="flex items-center gap-2">
            <AlertTitle className="text-green-600">Payment Recorded</AlertTitle>
          </div>
          <AlertDescription className="text-green-700 mt-1">
            Tuition payment of {formatToCurrency(resp.amount)} has been
            successfully recorded.
          </AlertDescription>
        </>
      );
    },
    onError: (error: Error) => {
      toast.error(
        <>
          <div className="flex items-center gap-2">
            <AlertTitle className="text-rose-600">Payment Failed!</AlertTitle>
          </div>
          <AlertDescription className="text-rose-700 mt-1 capitalize">
            {error.message}
          </AlertDescription>
        </>
      );
    },
    onSettled: () => {
      hideLoading();
    },
  });
}
