import { Gender } from "@/constants/enums";

export default interface Student {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  full_name: string;
  gender: Gender;
  Age: number;
  birthdate: string;
  address: string;
  mother_name: string;
  mother_occupation: string;
  mother_education_attain: string;
  father_name: string;
  father_occupation: string;
  father_education_attain: string;
  contact_numbers: string[];
  living_with: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
