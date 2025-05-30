import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEnrollment } from "@/services/enrollments";
import { logActivity } from "@/lib/activity-logger";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/context/loading-prover";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";

export function useDeleteEnrollmentMutation(
  first_name: string | undefined,
  last_name: string | undefined
) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showLoading } = useLoading();

  return useMutation({
    mutationFn: (enrollmentID: string | undefined) =>
      deleteEnrollment(enrollmentID),
    onMutate: () => {
      showLoading(`Deleting ${first_name} ${last_name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment"], exact: true });

      logActivity({
        action: "Deleted",
        entityType: "Tuition",
        entityId: "test tuition id",
        details: "deleted",
      });

      navigate("/enrollment");

      toast.success(
        <>
          <div className="flex items-center gap-2">
            <AlertTitle className="text-rose-400">
              Enrollment Deleted
            </AlertTitle>
          </div>
          <AlertDescription className="text-rose-500 mt-1">
            {`The enrollment record of ${first_name} ${last_name} has been successfully deleted`}
          </AlertDescription>
        </>
      );
    },
    onError: (error: Error) => {
      toast.error(
        <>
          <div className="flex items-center gap-2">
            <AlertTitle className="text-rose-600">
              Enrollment Failed!
            </AlertTitle>
          </div>
          <AlertDescription className="text-rose-700 mt-1 capitalize">
            {error.message}
          </AlertDescription>
        </>
      );
    },
  });
}
