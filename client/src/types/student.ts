export interface Student {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  fullname: string;
  gender: string;
  birthdate: string;
  living_with: string;
  parents: {
    contactNumbers: string[];
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
