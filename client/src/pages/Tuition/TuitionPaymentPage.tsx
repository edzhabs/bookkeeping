import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import CalendarComponent from "@/components/Calendar";
import CardPayment from "@/components/Payments/CardPayment";
import InvoiceNumber from "@/components/Payments/InvoiceNumber";
import Notes from "@/components/Payments/Notes";
import PaymentMethod from "@/components/Payments/PaymentMethod";
import StudentSection from "@/components/Payments/StudentSection";
import TotalAmount from "@/components/Payments/TotalAmount";
import TuitionAmountInput from "@/components/Payments/TuitionAmountInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { TuitionPaymentSchema } from "@/lib/validation/tuitionSchema";

export default function TuitionPaymentPage() {
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const form = useForm<z.infer<typeof TuitionPaymentSchema>>({
    resolver: zodResolver(TuitionPaymentSchema),
    defaultValues: {
      studentID: undefined,
      reservationFee: 0,
      tuitionFee: 0,
      advancePayment: 0,
      salesInvoiceNo: "",
      notes: "",
      paymentDate: new Date(),
    },
  });

  // Use useWatch to monitor specific fields
  const [reservationFee, tuitionFee, advancePayment] = useWatch({
    control: form.control,
    name: ["reservationFee", "tuitionFee", "advancePayment"], // Fields to watch
  });

  // Calculate total amount whenever the watched fields change
  useEffect(() => {
    const total =
      (Number(reservationFee) || 0) +
      (Number(tuitionFee) || 0) +
      (Number(advancePayment) || 0);
    setTotalAmount(total);
  }, [reservationFee, tuitionFee, advancePayment]);

  function onSubmit(values: z.infer<typeof TuitionPaymentSchema>) {
    console.log(values);
    // Here you would typically send the data to your backend
    alert("Payment submitted successfully!");
  }

  return (
    <CardPayment
      title="Tuition Payment Form"
      description="Enter payment details for student tuition and fees"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <StudentSection<z.infer<typeof TuitionPaymentSchema>> form={form} />

          {/* Tuition Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tuition</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
              <TuitionAmountInput<z.infer<typeof TuitionPaymentSchema>>
                form={form}
                label="Reservation Fee (₱)"
                name="reservationFee"
              />
              <TuitionAmountInput<z.infer<typeof TuitionPaymentSchema>>
                form={form}
                label="Tuition Fee (₱)"
                name="tuitionFee"
              />
              <TuitionAmountInput<z.infer<typeof TuitionPaymentSchema>>
                form={form}
                label="Advance Payment (₱)"
                name="advancePayment"
              />
            </div>
            {form.formState.errors.fees?.message && (
              <p className="text-sm text-destructive mt-2">
                {form.formState.errors.fees.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
            <PaymentMethod<z.infer<typeof TuitionPaymentSchema>> form={form} />
            <InvoiceNumber<z.infer<typeof TuitionPaymentSchema>> form={form} />
            <CalendarComponent<z.infer<typeof TuitionPaymentSchema>>
              name="paymentDate"
              label="Date of Payment"
              form={form}
            />
          </div>

          <Notes<z.infer<typeof TuitionPaymentSchema>> form={form} />

          <Separator />

          <TotalAmount totalAmount={totalAmount} />

          <Button type="submit" className="w-full">
            Submit Payment
          </Button>
        </form>
      </Form>
    </CardPayment>
  );
}
