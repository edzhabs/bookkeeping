"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityLog } from "@/components/activity-log"
import type { Student } from "@/types/student"
import type { ActivityLogItem } from "@/types/activity-log"

interface StudentDetailsProps {
  student: Student
  isOpen: boolean
  onClose: () => void
}

// Sample activity log data
const sampleActivityLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Student",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Student record was created",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Student",
    entityId: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Updated student information",
  },
]

export function StudentDetails({ student, isOpen, onClose }: StudentDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            Detailed information about {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Student Information</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">
                    {student.firstName} {student.middleName} {student.lastName} {student.suffix}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-muted-foreground">{student.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Birthdate</p>
                  <p className="text-sm text-muted-foreground">{new Date(student.birthdate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">School Year</p>
                  <p className="text-sm text-muted-foreground">{student.schoolYear}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Living With</p>
                  <p className="text-sm text-muted-foreground">{student.livingWith || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Discount</p>
                  <p className="text-sm text-muted-foreground">{student.discount || "None"}</p>
                </div>
              </CardContent>
            </Card>

            {(student.parents.father || student.parents.mother) && (
              <Card>
                <CardHeader>
                  <CardTitle>Parents Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.parents.father && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Father</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-muted-foreground">{student.parents.father.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Occupation</p>
                          <p className="text-sm text-muted-foreground">
                            {student.parents.father.job || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Education</p>
                          <p className="text-sm text-muted-foreground">
                            {student.parents.father.educationAttainment || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {student.parents.mother && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Mother</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-muted-foreground">{student.parents.mother.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Occupation</p>
                          <p className="text-sm text-muted-foreground">
                            {student.parents.mother.job || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Education</p>
                          <p className="text-sm text-muted-foreground">
                            {student.parents.mother.educationAttainment || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <ActivityLog logs={sampleActivityLogs.filter((log) => log.entityId === student.id)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
