import CONSTANTS from "@/constants/constants";

export interface Student {
  id?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  full_name?: string;
  gender?: "Male" | "Female";
  birthdate?: string;
  address?: string;
  living_with?: string;
  contact_numbers?: string[];
  father_name?: string;
  father_job?: string;
  father_education?: string;
  mother_name?: string;
  mother_job?: string;
  mother_education?: string;
}

export interface StudentDropdown {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  address: string;
  grade_level: IGradeLevel;
  school_year: string;
}

export type IGradeLevel = (typeof CONSTANTS.GRADELEVELS)[number];
