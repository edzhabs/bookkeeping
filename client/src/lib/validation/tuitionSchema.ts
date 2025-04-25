import { z } from "zod";

export const TuitionPaymentSchema = z
  .object({
    schoolYear: z.string({
      required_error: "Please select a school year.",
    }),
    studentID: z
      .number({
        required_error: "Please select a student.",
      })
      .positive({ message: "Invalid student," }),
    reservationFee: z.coerce
      .number()
      .min(0, {
        message: "Reservation fee must be a positive number.",
      })
      .optional(),
    tuitionFee: z.coerce
      .number()
      .min(0, {
        message: "Tuition fee must be a positive number.",
      })
      .optional(),
    advancePayment: z.coerce
      .number()
      .min(0, {
        message: "Advance payment must be a positive number.",
      })
      .optional(),
    paymentMethod: z.enum(["cash", "gcash", "bank"], {
      required_error: "Please select a payment method.",
    }),
    salesInvoiceNo: z
      .string({
        required_error: "Sales invoice number is required.",
      })
      .min(1, {
        message: "Sales invoice number is required.",
      }),
    paymentDate: z.date({ required_error: "Please select date of payment" }),
    notes: z.string().optional(),
    fees: z.number().optional(),
  })
  .refine(
    (data) => {
      const total =
        (data.reservationFee || 0) +
        (data.tuitionFee || 0) +
        (data.advancePayment || 0);
      return total > 0;
    },
    {
      message: "At least one payment amount is required.",
      path: ["fees"],
    }
  );
