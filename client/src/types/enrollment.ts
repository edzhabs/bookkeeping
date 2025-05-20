import { Student } from "./student";

export interface EnrollmentTable {
  id: string;
  full_name: string;
  type: "old" | "new";
  gender: "male" | "female";
  grade_level: string;
  school_year: string;
  discount_types: string[];
  total_amount: string;
  total_paid: string;
  remaining_amount: string;
  payment_status: "paid" | "partial" | "unpaid";
}

export interface StudentEnrollmentDetails extends EnrollmentTable {
  student: Student;
}

interface DiscountType {
  rank_1: string;
  sibling: string;
  full_year: string;
  scholar: string;
  none: string;
}

export interface EnrollNewStudent {
  student: Student;
  school_year: string;
  type: "old" | "new";
  grade_level: string;
  monthly_tuition: number;
  enrollment_fee: number;
  misc_fee: number;
  pta_fee: number;
  lms_books_fee: number;
  discounts: string[];
}
