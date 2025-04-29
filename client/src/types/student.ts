export interface Student {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  birthdate: string;
  school_year: string;
  suffix: string;
  livingWith: string;
  parents: {
    father?: {
      fullName: string;
      job: string;
      educationAttainment: string;
    };
    mother?: {
      fullName: string;
      job: string;
      educationAttainment: string;
    };
  };
}
