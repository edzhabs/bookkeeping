import { z } from "zod";

const TuitionPaymentSchema = z.object({
  student_id: z.string().min(1, { message: "Please select a student." }),
  school_year: z.string().min(1, { message: "Please select a school year." }),
  grade_level: z.string().min(1, { message: "Please select a grade level." }),
  amount: z.coerce
    .number()
    .min(1, { message: "Tuition fee must be greater than 0." }),
  payment_method: z.enum(["cash", "g-cash", "bank"], {
    required_error: "Please select a payment method.",
  }),
  invoice_number: z.string().min(1, { message: "O.R number is required." }),
  payment_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  notes: z.string().optional(),
});

export default TuitionPaymentSchema;
