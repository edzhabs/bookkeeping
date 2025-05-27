import CONSTANTS from "@/constants/constants";
import { z } from "zod";

const contactNumberRegex = /^(\+?\d{7,15})$/; // Adjust regex for your preferred format

const newEnrollmentSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name is required and must be at least 2 characters.",
  }),
  middle_name: z.string().min(2, {
    message: "Middle name is required and must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name is required and must be at least 2 characters.",
  }),
  suffix: z.string().optional(),
  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required.",
  }),
  birthdate: z
    .string()
    .refine(
      (date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
      },
      { message: "Please enter a valid date." }
    )
    .refine(
      (date) => {
        const parsed = new Date(date);
        return parsed <= new Date();
      },
      { message: "Birthdate cannot be in the future." }
    ),
  address: z.string().min(2, {
    message: "Address is required and must be at least 2 characters.",
  }),
  school_year: z
    .string()
    .regex(/^\d{4}-\d{4}$/, {
      message:
        "Please enter a valid school year in the format YYYY-YYYY (e.g., 2022-2023).",
    })
    .refine(
      (val) => {
        const [start, end] = val.split("-").map(Number);
        return end - start === 1;
      },
      {
        message: "School year must span exactly one year (e.g., 2022-2023).",
      }
    ),
  grade_level: z.enum(CONSTANTS.GRADELEVELS, {
    required_error: "Please select a grade level.",
  }),
  living_with: z.string().optional(),
  father_name: z.string().optional(),
  father_job: z.string().optional(),
  father_education: z.string().optional(),
  mother_name: z.string().optional(),
  mother_job: z.string().optional(),
  mother_education: z.string().optional(),
  contact_numbers: z.array(
    z
      .string()
      .min(7, { message: "Invalid contact number." })
      .regex(contactNumberRegex, {
        message: "Invalid contact number.",
      })
  ),
});

export default newEnrollmentSchema;
