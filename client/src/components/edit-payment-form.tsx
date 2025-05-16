"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import type { Tuition, Payment } from "@/types/tuition"

const formSchema = z
  .object({
    reservationFee: z.coerce.number().min(0, { message: "Reservation fee cannot be negative." }),
    tuitionFee: z.coerce.number().min(0, { message: "Tuition fee cannot be negative." }),
    advancePayment: z.coerce.number().min(0, { message: "Advance payment cannot be negative." }),
    paymentMethod: z.enum(["Cash", "Credit Card", "Bank Transfer", "Online Payment"]),
    invoiceNumber: z.string().min(1, { message: "Invoice number is required." }),
    paymentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Please enter a valid date.",
    }),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const total = data.reservationFee + data.tuitionFee + data.advancePayment
      return total > 0
    },
    {
      message: "At least one payment type must have a value greater than 0.",
      path: ["reservationFee"],
    },
  )

interface EditPaymentFormProps {
  isOpen: boolean
  onClose: () => void
  tuition: Tuition
  payment: Payment
  onSubmit: (paymentData: {
    reservationFee: number
    tuitionFee: number
    advancePayment: number
    method: string
    invoiceNumber: string
    date: string
    notes: string
  }) => void
}

export function EditPaymentForm({ isOpen, onClose, tuition, payment, onSubmit }: EditPaymentFormProps) {
  const [totalAmount, setTotalAmount] = useState(payment.amount)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reservationFee: payment.reservationFee,
      tuitionFee: payment.tuitionFee,
      advancePayment: payment.advancePayment,
      paymentMethod: payment.method as "Cash" | "Credit Card" | "Bank Transfer" | "Online Payment",
      invoiceNumber: payment.invoiceNumber,
      paymentDate: payment.date,
      notes: payment.notes || "",
    },
  })

  // Calculate total amount whenever fees change
  useEffect(() => {
    const reservationFee = form.watch("reservationFee") || 0
    const tuitionFee = form.watch("tuitionFee") || 0
    const advancePayment = form.watch("advancePayment") || 0

    setTotalAmount(reservationFee + tuitionFee + advancePayment)
  }, [form.watch("reservationFee"), form.watch("tuitionFee"), form.watch("advancePayment"), form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      reservationFee: values.reservationFee,
      tuitionFee: values.tuitionFee,
      advancePayment: values.advancePayment,
      method: values.paymentMethod,
      invoiceNumber: values.invoiceNumber,
      date: values.paymentDate,
      notes: values.notes || "",
    })
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>Update payment information for {tuition.studentName}'s tuition.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Student:</p>
                      <p className="text-sm text-muted-foreground">{tuition.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Invoice Number:</p>
                      <p className="text-sm text-muted-foreground">{payment.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Original Amount:</p>
                      <p className="text-sm text-muted-foreground">₱{payment.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="reservationFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reservation Fee</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tuitionFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuition Fee</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="advancePayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Payment</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Online Payment">Online Payment</SelectItem>
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
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any payment notes here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">Total Amount:</p>
                <p className="text-lg font-bold">₱{totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={totalAmount <= 0}>
                Update Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
