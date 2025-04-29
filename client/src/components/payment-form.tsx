import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Tuition } from "@/types/tuition";

const formSchema = z
  .object({
    reservationFee: z.coerce
      .number()
      .min(0, { message: "Reservation fee cannot be negative." }),
    tuitionFee: z.coerce
      .number()
      .min(0, { message: "Tuition fee cannot be negative." }),
    advancePayment: z.coerce
      .number()
      .min(0, { message: "Advance payment cannot be negative." }),
    paymentMethod: z.enum([
      "Cash",
      "Credit Card",
      "Bank Transfer",
      "Online Payment",
    ]),
    invoiceNumber: z
      .string()
      .min(1, { message: "Invoice number is required." }),
    paymentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Please enter a valid date.",
    }),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const total = data.reservationFee + data.tuitionFee + data.advancePayment;
      return total > 0;
    },
    {
      message: "At least one payment type must have a value greater than 0.",
      path: ["reservationFee"],
    }
  );

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  tuition: Tuition;
  onSubmit: (
    tuitionId: string,
    paymentData: {
      reservationFee: number;
      tuitionFee: number;
      advancePayment: number;
      method: string;
      invoiceNumber: string;
      date: string;
      notes: string;
    }
  ) => void;
}

export function PaymentForm({
  isOpen,
  onClose,
  tuition,
  onSubmit,
}: PaymentFormProps) {
  // Generate a unique invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900) + 100;
    return `TUI-${year}-${random}`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reservationFee: 0,
      tuitionFee: 0,
      advancePayment: 0,
      paymentMethod: "Cash",
      invoiceNumber: generateInvoiceNumber(),
      paymentDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const [reservationFee, tuitionFee, advancePayment] = useWatch({
    control: form.control,
    name: ["reservationFee", "tuitionFee", "advancePayment"],
  });

  // Calculate total amount dynamically
  const totalAmount = useMemo(() => {
    return (reservationFee || 0) + (tuitionFee || 0) + (advancePayment || 0);
  }, [reservationFee, tuitionFee, advancePayment]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      onSubmit(tuition.id, {
        reservationFee: values.reservationFee,
        tuitionFee: values.tuitionFee,
        advancePayment: values.advancePayment,
        method: values.paymentMethod,
        invoiceNumber: values.invoiceNumber,
        date: values.paymentDate,
        notes: values.notes || "",
      });
      form.reset();
    },
    [onSubmit, tuition.id, form]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Make Tuition Payment</DialogTitle>
          <DialogDescription>
            Create a new payment for {tuition.studentName}'s tuition.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4">
              <Card>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Student:</p>
                      <p className="text-sm text-muted-foreground">
                        {tuition.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Grade Level:</p>
                      <p className="text-sm text-muted-foreground">
                        {tuition.gradeLevel}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Discount:</p>
                      <p className="text-sm text-muted-foreground">
                        {tuition.discount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Remaining Balance:</p>
                      <p className="text-sm text-muted-foreground">
                        ₱{tuition.remainingBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="reservationFee"
                  render={({ field }) => (
                    <FormItem className="min-h-[80px]">
                      <FormLabel>Reservation Fee</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tuitionFee"
                  render={({ field }) => (
                    <FormItem className="min-h-[80px]">
                      <FormLabel>Tuition Fee</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="advancePayment"
                  render={({ field }) => (
                    <FormItem className="min-h-[80px]">
                      <FormLabel>Advance Payment</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="min-h-[80px]">
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="Online Payment">
                            Online Payment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem className="min-h-[80px]">
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="min-h-[80px]">
                      <FormLabel>Payment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="min-h-[80px]">
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any payment notes here..."
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">Total Amount:</p>
                <p className="text-lg font-bold">
                  ₱{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  totalAmount <= 0 || totalAmount > tuition.remainingBalance
                }
                className="w-full sm:w-auto"
              >
                Submit Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
