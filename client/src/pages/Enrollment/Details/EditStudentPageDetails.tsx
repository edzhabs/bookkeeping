import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

import EnrollmentTabs from "@/components/Tabs/enrollment-tabs";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/loading-prover";
import { fetchEditEnrollmentDetails } from "@/services/enrollments";
import { EnrollStudent } from "@/types/enrollment";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export default function EditStudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const { data, isLoading, isError } = useQuery<{
    data: EnrollStudent;
  }>({
    queryKey: ["enrollment", params.id, "edit"],
    queryFn: () => fetchEditEnrollmentDetails(params.id),
  });
  const enrollment = data?.data;

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  if (!enrollment) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Student Not Found</h1>
        </div>
        <p>The requested student record could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Enrollment</h1>
      </div>

      <EnrollmentTabs isEdit={true} data={enrollment} />
    </div>
  );
}
