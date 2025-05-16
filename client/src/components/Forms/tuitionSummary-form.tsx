import { Button } from "@/components/ui/button";
import { EnrollNewStudent } from "@/types/enrollment";
import { useEffect, useState } from "react";
import TuitionBreakdown from "../tuition-breakdown";

interface TuitionSummaryFormProps {
  enrollmentData: EnrollNewStudent;
  totalTuitionFee: number;
  rankOneDiscountAmount: number;
  siblingDiscountAmount: number;
  fullYearDiscountAmount: number;
  scholarDiscountAmount: number;
  discountAmount: number;
  totalAmount: number;
  isPending: boolean;
  handleSubmit: () => void;
  setActiveTab: (tab: string) => void;
}

const TuitionSummaryForm = ({
  enrollmentData,
  rankOneDiscountAmount,
  siblingDiscountAmount,
  fullYearDiscountAmount,
  scholarDiscountAmount,
  totalAmount,
  isPending,
  totalTuitionFee,
  discountAmount,
  handleSubmit,
  setActiveTab,
}: TuitionSummaryFormProps) => {
  const [discountLabel, setDiscountLabel] = useState("None");
  const [isRankOne, setRankOne] = useState(false);

  useEffect(() => {
    const discountDescription: string[] = [];
    enrollmentData.discounts.map((discount) => {
      if (discount === "rank_1") {
        discountDescription.push("Rank One (Free Quipper)");
      }
      switch (discount) {
        case "sibling":
          discountDescription.push("Sibling Discount (5%)");
          break;
        case "full_year":
          discountDescription.push("Full Year Payment (1 month free)");
          break;
        case "scholar":
          discountDescription.push("Scholar (50%)");
          break;
        default:
          break;
      }
    });
    // Update student discount description
    if (discountDescription.length > 0) {
      setDiscountLabel(discountDescription.join(" + "));
    } else {
      setDiscountLabel("None");
    }

    const isRankOne = !!enrollmentData.discounts.find(
      (discount) => discount === "rank_1"
    );
    if (isRankOne) {
      setRankOne(true);
    }
  }, [enrollmentData.discounts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium">Student:</p>
              <p className="text-sm capitalize text-muted-foreground">
                {enrollmentData.student.first_name}{" "}
                {enrollmentData.student.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Grade Level:</p>
              <p className="text-sm capitalize text-muted-foreground">
                {enrollmentData.grade_level || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Discount:</p>
              <p className="text-sm text-muted-foreground">
                {discountLabel || "None"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">School Year:</p>
              <p className="text-sm text-muted-foreground">
                {enrollmentData.school_year}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted p-6 rounded-md space-y-4">
          <h3 className="text-lg font-medium">Tuition Breakdown</h3>
          <TuitionBreakdown
            enrollment_fee={enrollmentData.enrollment_fee}
            monthly_tuition={totalTuitionFee}
            misc_fee={enrollmentData.misc_fee}
            pta_fee={enrollmentData.pta_fee}
            lms_books_fee={enrollmentData.lms_books_fee}
            isRankOne={isRankOne}
            rankOneDiscountAmount={rankOneDiscountAmount}
            siblingDiscountAmount={siblingDiscountAmount}
            fullYearDiscountAmount={fullYearDiscountAmount}
            scholarDiscountAmount={scholarDiscountAmount}
            discountAmount={discountAmount}
            totalAmount={totalAmount}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab("fees")}
        >
          Back to Fees & Discounts
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          Complete Enrollment
        </Button>
      </div>
    </div>
  );
};

export default TuitionSummaryForm;
