import { Student } from "./student";

export interface Enrollment extends Student {
  discountType: string;
  discountPercentage: number;
  gradeLevel: string;
}
