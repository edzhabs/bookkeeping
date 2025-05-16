import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { logActivity } from "@/lib/activity-logger";
import { enrollNewStudent } from "@/services/enrollments";
import { EnrollNewStudent } from "@/types/enrollment";
import { useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import StudentInfoForm from "../Forms/student-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TuitionFeeTab from "./tuitionFee-tab";
import { useLoading } from "@/context/loading-prover";

const EnrollmentTabs = () => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [activeTab, setActiveTab] = useState("student");
  const [enrollmentData, setEnrollmentData] = useState<EnrollNewStudent | null>(
    null
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: enrollNewStudent,
    onMutate: () => {
      showLoading();
    },
    onSuccess: (_, newEnrollment) => {
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });

      logActivity({
        action: "Created",
        entityType: "Tuition",
        entityId: "test tuition id",
        details: `Created tuition record for ${newEnrollment.student.first_name} ${newEnrollment.student.last_name} for school year ${newEnrollment.school_year}`,
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

  const handleSubmit = async () => {
    if (!enrollmentData) return;
    mutation.mutate(enrollmentData);
  };

  return (
    <Tabs value={activeTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="student">Student Information</TabsTrigger>
        <TabsTrigger value="fees" disabled={!enrollmentData}>
          Fees & Discounts
        </TabsTrigger>
        <TabsTrigger value="tuition" disabled={!enrollmentData}>
          Tuition Summary
        </TabsTrigger>
      </TabsList>

      <div
        className={`space-y-6 ${activeTab === "student" ? "block" : "hidden"}`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentInfoForm
              setActiveTab={setActiveTab}
              setEnrollmentData={setEnrollmentData}
            />
          </CardContent>
        </Card>
      </div>

      <TuitionFeeTab
        enrollmentData={enrollmentData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setEnrollmentData={setEnrollmentData}
        handleSubmit={handleSubmit}
        isPending={mutation.isPending}
      />
    </Tabs>
  );
};

export default EnrollmentTabs;
