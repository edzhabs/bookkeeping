import { useForm } from "react-hook-form";
import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  invoiceNumber: z.string().min(1, { message: "Invoice number is required." }),
  paymentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  paymentMethod: z.enum([
    "Cash",
    "Credit Card",
    "Bank Transfer",
    "Online Payment",
  ]),
  notes: z.string().optional(),
  // For tuition payments only
  reservationFee: z.coerce
    .number()
    .min(0, { message: "Reservation fee cannot be negative." })
    .optional(),
  tuitionFee: z.coerce
    .number()
    .min(0, { message: "Tuition fee cannot be negative." })
    .optional(),
  advancePayment: z.coerce
    .number()
    .min(0, { message: "Advance payment cannot be negative." })
    .optional(),
});

// Add the remarks field to the form props
interface EditTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onSubmit: (transactionId: string, updatedData: any) => void;
}

export function EditTransactionForm({
  isOpen,
  onClose,
  transaction,
  onSubmit,
}: EditTransactionFormProps) {
  const isTuition = transaction.type === "Tuition";
  const [totalAmount, setTotalAmount] = useState(transaction.amount);
  const [error, setError] = useState<string | null>(null);

  const tuitionPayment = transaction.originalPayment;

  // Update the form state to include remarks
  const [formData, setFormData] = useState({
    invoiceNumber: transaction.invoiceNumber,
    date: transaction.date,
    method: transaction.method,
    notes: transaction.notes || "",
    remarks: "", // Add remarks field
    ...(isTuition && {
      reservationFee: tuitionPayment?.reservationFee || 0,
      tuitionFee: tuitionPayment?.tuitionFee || 0,
      advancePayment: tuitionPayment?.advancePayment || 0,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: transaction.invoiceNumber,
      paymentDate: new Date(transaction.date).toISOString().split("T")[0],
      paymentMethod: transaction.method as
        | "Cash"
        | "Credit Card"
        | "Bank Transfer"
        | "Online Payment",
      notes: transaction.notes || "",
      ...(isTuition && {
        reservationFee: tuitionPayment?.reservationFee || 0,
        tuitionFee: tuitionPayment?.tuitionFee || 0,
        advancePayment: tuitionPayment?.advancePayment || 0,
      }),
    },
  });

  // Calculate total amount whenever fees change (for tuition payments)
  useEffect(() => {
    if (isTuition) {
      const reservationFee = form.watch("reservationFee") || 0;
      const tuitionFee = form.watch("tuitionFee") || 0;
      const advancePayment = form.watch("advancePayment") || 0;
      setTotalAmount(reservationFee + tuitionFee + advancePayment);
    }
  }, [
    form.watch("reservationFee"),
    form.watch("tuitionFee"),
    form.watch("advancePayment"),
    form,
    isTuition,
  ]);

  // Update the handleSubmit function to include remarks
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.remarks.trim()) {
      setError("Please provide a reason for this update");
      return;
    }

    // Calculate total amount for tuition payments
    const totalAmount = isTuition
      ? formData.reservationFee + formData.tuitionFee + formData.advancePayment
      : transaction.amount;

    onSubmit(transaction.id, {
      ...formData,
      amount: totalAmount,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update transaction details for {transaction.studentName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Student:</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type:</p>
                      <Badge variant={isTuition ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                    </div>
                    {!isTuition && (
                      <div>
                        <p className="text-sm font-medium">Amount:</p>
                        <p className="text-sm text-muted-foreground">
                          ₱{transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isTuition && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="reservationFee"
                    render={({ field }) => (
                      <FormItem className="min-h-[80px]">
                        <FormLabel>Reservation Fee</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="w-full"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                reservationFee:
                                  Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
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
                          <Input
                            type="number"
                            {...field}
                            className="w-full"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                tuitionFee:
                                  Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
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
                          <Input
                            type="number"
                            {...field}
                            className="w-full"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                advancePayment:
                                  Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem className="min-h-[80px]">
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              invoiceNumber: e.target.value,
                            })
                          }
                        />
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
                        <Input
                          type="date"
                          {...field}
                          className="w-full"
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="min-h-[80px]">
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        setFormData({ ...formData, method: value })
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
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
                name="notes"
                render={({ field }) => (
                  <FormItem className="min-h-[80px]">
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any payment notes here..."
                        {...field}
                        className="w-full"
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isTuition && (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">Total Amount:</p>
                  <p className="text-lg font-bold">
                    ₱{totalAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Add this before the form buttons */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="remarks" className="font-medium">
                Reason for Update <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                placeholder="Please provide a reason for this update"
                className="w-full"
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:gap-0 md:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Update Transaction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
