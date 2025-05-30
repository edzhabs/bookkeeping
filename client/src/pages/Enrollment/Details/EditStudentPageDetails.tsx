import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import EnrollmentTabs from "@/components/Tabs/enrollment-tabs";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/loading-prover";
import { fetchEditEnrollmentDetails } from "@/services/enrollments";
import { EnrollStudent } from "@/types/enrollment";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RecordNotFound } from "@/components/Errors/record-notFound";
import { useEnrollStudentMutation } from "@/hooks/useEnrollStudentMutation";

export default function EditStudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [enrollmentData, setEnrollmentData] = useState<EnrollStudent | null>(
    null
  );
  const { data, isLoading, isError, error } = useQuery<{
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

  const mutation = useEnrollStudentMutation(true);

  const handleSubmit = async () => {
    if (!enrollmentData) return;
    mutation.mutate({ body: enrollmentData, enrollmentID: params.id });
  };

  if (isError) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const entity = params.id ? `Enrollment ID: ${params.id}` : undefined;
      return (
        <RecordNotFound
          entityType="enrollment"
          entityName={entity}
          backHref="/enrollment"
          listHref="/enrollment"
        />
      );
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Enrollment</h1>
      </div>

      <EnrollmentTabs
        isEdit={true}
        data={enrollment}
        enrollmentData={enrollmentData}
        setEnrollmentData={setEnrollmentData}
        handleSubmit={handleSubmit}
        isPending={mutation.isPending}
      />
    </div>
  );
}
