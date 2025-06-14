import { z } from "zod";

const TuitionPaymentSchema = z.object({
  student_id: z.string().min(1, { message: "Please select a student." }),
  school_year: z.string().min(1, { message: "Please select a school year." }),
  grade_level: z.string().min(1, { message: "Please select a grade level." }),
  amount: z.coerce.number().min(1, { message: "Tuition fee is required." }),
  payment_method: z.enum(["cash", "g-cash", "bank"], {
    required_error: "Please select a payment method.",
  }),
  invoice_number: z.string().min(1, { message: "O.R number is required." }),
  payment_date: z
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
      { message: "Payment Date cannot be in the future." }
    ),
  notes: z.string().optional(),
});

export default TuitionPaymentSchema;
