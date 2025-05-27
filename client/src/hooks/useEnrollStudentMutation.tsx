import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollStudent } from "@/services/enrollments";
import { logActivity } from "@/lib/activity-logger";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/context/loading-prover";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";

export function useEnrollStudentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: enrollStudent,
    onMutate: () => {
      showLoading("ENROLLING..");
    },
    onSuccess: (_, newEnrollment) => {
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });

      logActivity({
        action: "Created",
        entityType: "Tuition",
        entityId: "test tuition id",
        details: `Created tuition record for ${newEnrollment.student?.first_name} ${newEnrollment.student?.last_name} for school year ${newEnrollment.school_year}`,
      });

      navigate("/enrollment");

      toast.success(
        <>
          <div className="flex items-center gap-2">
            <AlertTitle className="text-green-600">
              Enrollment Successful
            </AlertTitle>
          </div>
          <AlertDescription className="text-green-700 mt-1">
            Student has been successfully enrolled with tuition record.
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
    onSettled: () => {
      hideLoading();
    },
  });
}
