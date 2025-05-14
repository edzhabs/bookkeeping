export interface Student {
  id: string;
  fist_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  full_name: string;
  gender: string;
  birthdate: string;
  living_with: string;
  contactNumbers: string[];
  parents: {
    father?: {
      name: string;
      job: string;
      educationAttainment: string;
    };
    mother?: {
      name: string;
      job: string;
      educationAttainment: string;
    };
  };
}
