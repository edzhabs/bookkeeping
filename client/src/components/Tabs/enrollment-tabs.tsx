import { EnrollStudent } from "@/types/enrollment";
import { useState } from "react";

import { Tabs } from "@/components/ui/tabs";
import StudentInfoForm from "../Forms/student-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import EnrollmentTabLists from "./enrollment-tabList";
import TuitionFeeTab from "./tuitionFee-tab";

interface Props {
  enrollmentData: EnrollStudent | null;
  isEdit?: boolean;
  data?: EnrollStudent;
  isPending: boolean;
  setEnrollmentData: (data: EnrollStudent | null) => void;
  handleSubmit: () => void;
}

const EnrollmentTabs = ({
  isEdit = false,
  isPending,
  data,
  enrollmentData,
  setEnrollmentData,
  handleSubmit,
}: Props) => {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <Tabs value={activeTab} className="space-y-6">
      <EnrollmentTabLists data={enrollmentData} />

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
              isEdit={isEdit}
              initialData={data}
            />
          </CardContent>
        </Card>
      </div>

      <TuitionFeeTab
        isEdit={isEdit}
        enrollmentData={enrollmentData}
        initialData={data}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setEnrollmentData={setEnrollmentData}
        handleSubmit={handleSubmit}
        isPending={isPending}
      />
    </Tabs>
  );
};

export default EnrollmentTabs;
