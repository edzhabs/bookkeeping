import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import OldStudentForm from "@/components/Forms/old-student-form";
import EnrollmentTabLists from "@/components/Tabs/enrollment-tabList";
import TuitionFeeTab from "@/components/Tabs/tuitionFee-tab";
import { Tabs } from "@/components/ui/tabs";
import { useEnrollStudentMutation } from "@/hooks/useEnrollStudentMutation";
import { EnrollStudent } from "@/types/enrollment";
import { useNavigate } from "react-router-dom";

export default function EnrollExistingStudentPage() {
  const navigate = useNavigate();

  const [enrollmentData, setEnrollmentData] = useState<EnrollStudent | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("student");

  const mutation = useEnrollStudentMutation();

  const handleSubmit = async () => {
    if (!enrollmentData) return;

    const enrollmentResponse: EnrollStudent = {
      student_id: enrollmentData.student_id,
      school_year: enrollmentData.school_year,
      grade_level: enrollmentData.grade_level,
      monthly_tuition: enrollmentData.monthly_tuition,
      type: enrollmentData.type,
      enrollment_fee: enrollmentData.enrollment_fee,
      misc_fee: enrollmentData.misc_fee,
      pta_fee: enrollmentData.pta_fee,
      lms_books_fee: enrollmentData.lms_books_fee,
      discounts: enrollmentData.discounts,
    };
    mutation.mutate(enrollmentResponse);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="sm:text-3xl text-2xl font-bold">
          Enroll Existing Student
        </h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enrollment Information</CardTitle>
          <CardDescription className="mb-3">
            Select an existing student and update their grade level and school
            year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} className="w-full">
            <EnrollmentTabLists data={enrollmentData} />

            <div
              className={`space-y-6 pt-4 ${
                activeTab === "student" ? "block" : "hidden"
              }`}
            >
              <OldStudentForm
                setEnrollmentData={setEnrollmentData}
                setActiveTab={setActiveTab}
              />
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
        </CardContent>
      </Card>
    </div>
  );
}
