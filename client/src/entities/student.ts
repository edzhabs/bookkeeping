export default interface Student {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  gender: "male" | "female";
  birthdate: string;
  address: string;
}
