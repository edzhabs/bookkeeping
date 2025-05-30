import { z } from "zod";

const feesFormSchema = z.object({
  enrollment_fee: z.coerce
    .number()
    .min(1, { message: "Enrollment Fee is required." }),
  monthly_tuition: z.coerce
    .number()
    .min(1, { message: "Monthly Tuition Fee is required." }),
  misc_fee: z.coerce.number().min(1, { message: "Misc Fee is required." }),
  pta_fee: z.coerce.number().min(1, { message: "PTA Fee is required." }),
  lms_books_fee: z.coerce
    .number()
    .min(1, { message: "Quipper/Books Fee is required." }),
  isRankOne: z.boolean(),
  hasSiblingDiscount: z.boolean(),
  hasWholeYearDiscount: z.boolean(),
  hasScholarDiscount: z.boolean(),
});

export default feesFormSchema;
