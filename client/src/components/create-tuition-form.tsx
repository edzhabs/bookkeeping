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
import { Card, CardContent } from "@/components/ui/card"
import type { Student } from "@/types/student"

const formSchema = z.object({
  schoolYear: z.string().min(4, { message: "Please enter a valid school year." }),
  baseTuition: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0." })
    .refine((val) => val > 0, { message: "Amount must be greater than 0." }),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
})

interface CreateTuitionFormProps {
  isOpen: boolean
  onClose: () => void
  student: Student
  onSubmit: (data: { studentId: string; schoolYear: string; baseTuition: number; dueDate: string }) => void
}

export function CreateTuitionForm({ isOpen, onClose, student, onSubmit }: CreateTuitionFormProps) {
  const [baseTuition, setBaseTuition] = useState(50000)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(50000)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolYear: student.schoolYear || new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      baseTuition: 50000,
      dueDate: new Date().toISOString().split("T")[0],
    },
  })

  // Calculate discount and total amount when base tuition changes
  useEffect(() => {
    const currentBaseTuition = form.watch("baseTuition")
    const discount = ((student.discountPercentage || 0) / 100) * currentBaseTuition
    setBaseTuition(currentBaseTuition)
    setDiscountAmount(discount)
    setTotalAmount(currentBaseTuition - discount)
  }, [form.watch("baseTuition"), student.discountPercentage])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      studentId: student.id,
      schoolYear: values.schoolYear,
      baseTuition: values.baseTuition,
      dueDate: values.dueDate,
    })
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Tuition Record</DialogTitle>
          <DialogDescription>
            Create a new tuition record for {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Student:</p>
                    <p className="text-sm text-muted-foreground">
                      {student.firstName} {student.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Grade Level:</p>
                    <p className="text-sm text-muted-foreground">{student.gradeLevel || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Discount:</p>
                    <p className="text-sm text-muted-foreground">
                      {student.discount || "None"} ({student.discountPercentage || 0}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="schoolYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Year</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 2023-2024" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseTuition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Tuition Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Base Tuition:</p>
                <p className="text-sm font-medium">₱{baseTuition.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Discount ({student.discountPercentage || 0}%):</p>
                <p className="text-sm font-medium">- ₱{discountAmount.toLocaleString()}</p>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <p className="text-sm font-medium">Total Tuition:</p>
                <p className="text-sm font-bold">₱{totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Tuition</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
