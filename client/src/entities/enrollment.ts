import { Student } from "@/types/student";

export default interface Enrollment extends Student {
  school_year: string;
  discount: number;
}
