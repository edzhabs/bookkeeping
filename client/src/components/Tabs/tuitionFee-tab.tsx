import { useState } from "react";
import TuitionSummaryForm from "../Forms/tuitionSummary-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { EnrollNewStudent } from "@/types/enrollment";
import TuitionFeeForm from "../Forms/tuitionFee-form";

interface TuitionProps {
  enrollmentData: EnrollNewStudent | null;
  setEnrollmentData: (data: EnrollNewStudent) => void;
  activeTab: string;
  isPending: boolean;
  setActiveTab: (tab: string) => void;
  handleSubmit: () => void;
}

const TuitionFeeTab = ({
  enrollmentData,
  activeTab,
  isPending,
  setActiveTab,
  setEnrollmentData,
  handleSubmit,
}: TuitionProps) => {
  const [totalTuitionFee, setTotalTuitionFee] = useState(0); // 10 months
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [rankOneDiscountAmount, setRankOneDiscountAmount] = useState(0);
  const [siblingDiscountAmount, setSiblingDiscountAmount] = useState(0);
  const [fullYearDiscountAmount, setFullYearDiscountAmount] = useState(0);
  const [scholarDiscountAmount, setScholarDiscountAmount] = useState(0);

  return (
    <>
      <div className={`space-y-6 ${activeTab === "fees" ? "block" : "hidden"}`}>
        {enrollmentData && (
          <Card>
            <CardHeader>
              <CardTitle>
                Fees & Discounts for {enrollmentData.student.first_name}{" "}
                {enrollmentData.student.last_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TuitionFeeForm
                enrollmentData={enrollmentData}
                discountAmount={discountAmount}
                rankOneDiscountAmount={rankOneDiscountAmount}
                siblingDiscountAmount={siblingDiscountAmount}
                fullYearDiscountAmount={fullYearDiscountAmount}
                scholarDiscountAmount={scholarDiscountAmount}
                totalAmount={totalAmount}
                setDiscountAmount={setDiscountAmount}
                setEnrollmentData={setEnrollmentData}
                setTotalAmount={setTotalAmount}
                setTotalTuitionFee={setTotalTuitionFee}
                setRankOneDiscountAmount={setRankOneDiscountAmount}
                setSiblingDiscountAmount={setSiblingDiscountAmount}
                setFullYearDiscountAmount={setFullYearDiscountAmount}
                setScholarDiscountAmount={setScholarDiscountAmount}
                setActiveTab={setActiveTab}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <div
        className={`space-y-6 ${activeTab === "tuition" ? "block" : "hidden"}`}
      >
        {enrollmentData && (
          <Card>
            <CardHeader className="mb-3">
              <CardTitle>
                Tuition Summary for{" "}
                <span className="capitalize">
                  {enrollmentData.student.first_name}{" "}
                  {enrollmentData.student.last_name}{" "}
                  {enrollmentData.student.suffix || ""}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TuitionSummaryForm
                enrollmentData={enrollmentData}
                totalTuitionFee={totalTuitionFee}
                rankOneDiscountAmount={rankOneDiscountAmount}
                siblingDiscountAmount={siblingDiscountAmount}
                fullYearDiscountAmount={fullYearDiscountAmount}
                scholarDiscountAmount={scholarDiscountAmount}
                totalAmount={totalAmount}
                discountAmount={discountAmount}
                handleSubmit={handleSubmit}
                isPending={isPending}
                setActiveTab={setActiveTab}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default TuitionFeeTab;
