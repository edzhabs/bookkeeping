"use client"

import { useState } from "react"
import { LucideSearch } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Student } from "@/types/student"

interface StudentSelectorProps {
  isOpen: boolean
  onClose: () => void
  students: Student[]
  onSelect: (student: Student) => void
}

export function StudentSelector({ isOpen, onClose, students, onSelect }: StudentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.schoolYear.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Student</DialogTitle>
          <DialogDescription>Choose a student to create a tuition record for</DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<LucideSearch className="h-4 w-4" />}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Gender</TableHead>
                <TableHead className="hidden md:table-cell">School Year</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.middleName ? student.middleName.charAt(0) + ". " : ""}
                      {student.lastName} {student.suffix}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{student.gender}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.schoolYear}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => onSelect(student)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
