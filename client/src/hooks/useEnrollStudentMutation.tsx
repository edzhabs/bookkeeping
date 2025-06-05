import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollStudent } from "@/services/enrollments";
import { logActivity } from "@/lib/activity-logger";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/context/loading-prover";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EnrollStudent } from "@/types/enrollment";
import CONSTANTS from "@/constants/constants";

interface MutationParam {
  body: EnrollStudent;
  enrollmentID?: string;
}

export function useEnrollStudentMutation(isEdit = false) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: ({ body, enrollmentID }: MutationParam) =>
      enrollStudent(body, enrollmentID),
    onMutate: () => {
      const msg = isEdit ? "Updating Enrollment.." : "Enrolling..";
      showLoading(msg);
    },
    onSuccess: (_, resp) => {
      queryClient.invalidateQueries({
        queryKey: [CONSTANTS.QUERYKEY.ENROLLMENT],
      });
      queryClient.invalidateQueries({
        queryKey: [CONSTANTS.QUERYKEY.STUDENTS],
      });

      logActivity({
        action: `${isEdit ? "Updated" : "Created"}`,
        entityType: "Tuition",
        entityId: "test tuition id",
        details: `Created tuition record for ${resp.body.student?.first_name} ${resp.body.student?.last_name} for school year ${resp.body.school_year}`,
      });

      navigate("/enrollment");

      toast.success(
        <>
          <div className="flex items-center gap-2">
            <AlertTitle className="text-green-600">
              {isEdit ? "Updating enrollment is" : "Enrollment"} Successful
            </AlertTitle>
          </div>
          <AlertDescription className="text-green-700 mt-1">
            {isEdit
              ? `The enrollment information of ${resp.body.student?.first_name} ${resp.body.student?.last_name} has been successfully updated.`
              : "Student has been successfully enrolled with tuition record."}
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
