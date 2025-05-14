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
  remaining_amount: string;
  payment_status: string;
}

export interface StudentEnrollmentDetails extends EnrollmentTable {
  student: Student;
}
