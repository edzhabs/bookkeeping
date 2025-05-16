export interface Student {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  full_name?: string;
  gender: "Male" | "Female";
  birthdate: string;
  address: string;
  living_with?: string;
  contact_numbers?: string[];
  father_name?: string;
  father_job?: string;
  father_education?: string;
  mother_name?: string;
  mother_job?: string;
  mother_education?: string;
}
