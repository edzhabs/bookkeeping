import { z } from "zod";

const paymentItemSchema = z
  .object({
    category: z.enum(
      [
        "enrollment_fee",
        "misc_fee",
        "pta_fee",
        "lms_fee",
        "id",
        "patch",
        "pe_shirt",
        "pe_pants",
        "carpool",
        "others",
      ],
      {
        required_error: "Please select a category.",
      }
    ),
    amount: z.coerce.number().min(1, { message: "Amount is required." }),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.category === "others" &&
        (!data.remarks || data.remarks.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Remarks are required when category is 'others'.",
      path: ["remarks"],
    }
  );

const OtherPaymentSchema = z.object({
  student_id: z.string().min(1, { message: "Please select a student." }),
  school_year: z.string().min(1, { message: "Please select a school year." }),
  grade_level: z.string().min(1, { message: "Please select a grade level." }),
  items: z
    .array(paymentItemSchema)
    .min(1, { message: "At least one payment item is required." }),
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

export default OtherPaymentSchema;
