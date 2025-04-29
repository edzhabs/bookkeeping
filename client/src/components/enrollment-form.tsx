"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Student } from "@/types/student"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  gender: z.enum(["Male", "Female", "Other"]),
  birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  schoolYear: z.string().min(4, { message: "Please enter a valid school year." }),
  suffix: z.string().optional(),
  livingWith: z.string().optional(),
  discount: z.string().optional(),
  fatherName: z.string().optional(),
  fatherJob: z.string().optional(),
  fatherEducation: z.string().optional(),
  motherName: z.string().optional(),
  motherJob: z.string().optional(),
  motherEducation: z.string().optional(),
})

interface EnrollmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (student: Student) => boolean
  student?: Student | null
}

export function EnrollmentForm({ isOpen, onClose, onSubmit, student }: EnrollmentFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const isEditing = !!student

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "Male",
      birthdate: "",
      schoolYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      suffix: "",
      livingWith: "Both Parents",
      discount: "None",
      fatherName: "",
      fatherJob: "",
      fatherEducation: "",
      motherName: "",
      motherJob: "",
      motherEducation: "",
    },
  })

  // Update form when editing a student
  useEffect(() => {
    if (student) {
      form.reset({
        firstName: student.firstName,
        middleName: student.middleName || "",
        lastName: student.lastName,
        gender: student.gender as "Male" | "Female" | "Other",
        birthdate: student.birthdate,
        schoolYear: student.schoolYear,
        suffix: student.suffix || "",
        livingWith: student.livingWith || "Both Parents",
        discount: student.discount || "None",
        fatherName: student.parents.father?.fullName || "",
        fatherJob: student.parents.father?.job || "",
        fatherEducation: student.parents.father?.educationAttainment || "",
        motherName: student.parents.mother?.fullName || "",
        motherJob: student.parents.mother?.job || "",
        motherEducation: student.parents.mother?.educationAttainment || "",
      })
    } else {
      form.reset({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "Male",
        birthdate: "",
        schoolYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
        suffix: "",
        livingWith: "Both Parents",
        discount: "None",
        fatherName: "",
        fatherJob: "",
        fatherEducation: "",
        motherName: "",
        motherJob: "",
        motherEducation: "",
      })
    }
  }, [student, form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const studentData: Student = {
      id: student?.id || "",
      firstName: values.firstName,
      middleName: values.middleName || "",
      lastName: values.lastName,
      gender: values.gender,
      birthdate: values.birthdate,
      schoolYear: values.schoolYear,
      suffix: values.suffix || "",
      livingWith: values.livingWith || "",
      discount: values.discount || "None",
      parents: {
        ...(values.fatherName
          ? {
              father: {
                fullName: values.fatherName,
                job: values.fatherJob || "",
                educationAttainment: values.fatherEducation || "",
              },
            }
          : {}),
        ...(values.motherName
          ? {
              mother: {
                fullName: values.motherName,
                job: values.motherJob || "",
                educationAttainment: values.motherEducation || "",
              },
            }
          : {}),
      },
    }

    const success = onSubmit(studentData)
    if (success) {
      form.reset()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Student" : "Enroll New Student"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the student information below."
              : "Fill out the form below to enroll a new student. Required fields are marked with an asterisk (*)."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="additional">Additional Information</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birthdate *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schoolYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Year *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 2023-2024" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("additional")}>
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="suffix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suffix</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Jr., III" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="livingWith"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Living With</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Both Parents">Both Parents</SelectItem>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Guardian">Guardian</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select discount" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Sibling Discount">Sibling Discount</SelectItem>
                            <SelectItem value="Scholar">Scholar</SelectItem>
                            <SelectItem value="Employee Discount">Employee Discount</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Father's Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fatherJob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fatherEducation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Bachelor's Degree" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Mother's Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motherJob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="motherEducation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Master's Degree" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Previous
                  </Button>
                  <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
