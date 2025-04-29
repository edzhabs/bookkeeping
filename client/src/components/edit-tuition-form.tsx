"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import type { Tuition } from "@/types/tuition"

const formSchema = z.object({
  schoolYear: z.string().min(4, { message: "Please enter a valid school year." }),
  totalAmount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0." })
    .refine((val) => val > 0, { message: "Amount must be greater than 0." }),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
})

interface EditTuitionFormProps {
  isOpen: boolean
  onClose: () => void
  tuition: Tuition
  onSubmit: (data: { schoolYear: string; totalAmount: number; dueDate: string }) => void
}

export function EditTuitionForm({ isOpen, onClose, tuition, onSubmit }: EditTuitionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolYear: tuition.schoolYear,
      totalAmount: tuition.totalAmount,
      dueDate: tuition.dueDate,
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      schoolYear: values.schoolYear,
      totalAmount: values.totalAmount,
      dueDate: values.dueDate,
    })
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tuition Record</DialogTitle>
          <DialogDescription>Update tuition information for {tuition.studentName}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium">Student:</p>
                <p className="text-sm text-muted-foreground">{tuition.studentName}</p>
              </div>

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
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Tuition Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update Tuition</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
