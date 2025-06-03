import { IGradeLevel, Student } from "./student";
import { DiscountDetails } from "./tuition";

export interface EnrollmentTable {
  id: string;
  type: "old" | "new";
  gender: "male" | "female";
  full_name: string;
  grade_level: string;
  school_year: string;
  discount_types: string[];
  total_tuition_amount_due: string;
  total_tuition_paid: string;
  total_other_paid: string;
  tuition_balance: string;
  tuition_payment_status: "paid" | "partial" | "unpaid";
}

export interface StudentEnrollmentDetails extends EnrollmentTable {
  student: Student;
  enrollment_fee: string;
  monthly_tuition: string;
  misc_fee: string;
  pta_fee: string;
  lms_books_fee: string;
  discount_total_amount: string;
  discount_details: DiscountDetails[];
}

interface DiscountTypes {
  isRankOne?: boolean;
  hasSiblingDiscount?: boolean;
  hasWholeYearDiscount?: boolean;
  hasScholarDiscount?: boolean;
}

export interface EnrollStudent extends DiscountTypes {
  student?: Student;
  student_id?: string;
  school_year: string;
  type?: "old" | "new";
  grade_level: IGradeLevel;
  enrollment_fee: number;
  monthly_tuition: number;
  misc_fee: number;
  pta_fee: number;
  lms_books_fee: number;
  discounts: string[];
}
