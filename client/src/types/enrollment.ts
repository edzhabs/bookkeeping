import { Student } from "./student";

export interface Enrollment extends Student {
  school_year: string;
  discount_type: string;
  discount_percentage: number;
  grade_level: string;
}

export interface EnrollmentTable {
  id: string;
  full_name: string;
  type: "old" | "new";
  gender: "male" | "female";
  grade_level: string;
  school_year: string;
  discount_types: string[];
  total_amount: string;
  remaining_amount: string;
  payment_status: string;
}
