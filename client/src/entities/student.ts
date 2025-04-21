import Enrollment from "./enrollment";
import Guardian from "./guardian";

export default interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  guardians: Guardian[];
  enrollments: Enrollment[];
}
