import CONSTANTS from "@/constants/constants";
import { z } from "zod";

const oldEnrollmentSchema = z.object({
  studentID: z.string().min(1, { message: "Please select a student." }),
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
});

export default oldEnrollmentSchema;
