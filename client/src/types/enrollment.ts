import { Student } from "./student";

export interface Enrollment extends Student {
  school_year: string;
  discount_type: string;
  discount_percentage: number;
  grade_level: string;
}
