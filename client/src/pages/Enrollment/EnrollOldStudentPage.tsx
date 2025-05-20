import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Student, StudentDropdown } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/context/loading-prover";
import { StudentCombobox } from "@/components/student-combo-box";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentsDropdown } from "@/services/students";
import CONSTANTS from "@/constants/constants";
import { formatDisplayGradeLevel } from "@/utils";

const schoolYears = ["2023-2024", "2024-2025", "2025-2026"];

export default function EnrollExistingStudentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<StudentDropdown>();
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("");
  const [selectedSchoolYear, setSelectedSchoolYear] =
    useState<string>("2023-2024");
  const [activeTab, setActiveTab] = useState("student");

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<{
    data: StudentDropdown[] | undefined;
  }>({
    queryKey: ["students"],
    queryFn: fetchStudentsDropdown,
  });

  const existingStudents = response?.data;

  const handleSubmit = () => {
    if (!selectedStudentId) {
      toast({
        title: "Error",
        description: "Please select a student to enroll.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGradeLevel) {
      toast({
        title: "Error",
        description: "Please select a grade level.",
        variant: "destructive",
      });
      return;
    }

    showLoading("Enrolling student for new school year...");

    // Simulate API call
    setTimeout(() => {
      hideLoading();
      toast({
        title: "Success",
        description:
          "Student has been successfully enrolled for the new school year.",
        variant: "default",
      });
      navigate("/enrollment?success=true");
    }, 1500);
  };

  const getNextGradeLevel = (currentGradeLevel: string): string => {
    const currentIndex = CONSTANTS.GRADELEVELS.indexOf(currentGradeLevel);
    if (
      currentIndex === -1 ||
      currentIndex === CONSTANTS.GRADELEVELS.length - 1
    ) {
      return "";
    }
    return CONSTANTS.GRADELEVELS[currentIndex + 1];
  };

  const handleStudentChange = (studentID: string) => {
    setSelectedStudentId(studentID);
    const student = existingStudents?.find((s) => s.id === studentID);
    if (student) {
      const nextGradeLevel = getNextGradeLevel(student.grade_level);
      setSelectedGradeLevel(nextGradeLevel);
      setSelectedStudent(student);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="sm:text-3xl text-2xl font-bold">
          Enroll Existing Student
        </h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enrollment Information</CardTitle>
          <CardDescription className="mb-3">
            Select an existing student and update their grade level and school
            year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student Selection</TabsTrigger>
              <TabsTrigger value="fees" disabled={!selectedStudentId}>
                Fees & Tuition
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <StudentCombobox
                    selectedValue=""
                    students={existingStudents || []}
                    placeholder="Select a student"
                    onValueChange={handleStudentChange}
                    isLoading={isLoading}
                  />
                </div>

                {selectedStudent && (
                  <>
                    <div className="rounded-md border p-4 space-y-4">
                      <h3 className="font-medium">Current Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p>
                            {selectedStudent.first_name}{" "}
                            {selectedStudent.middle_name}{" "}
                            {selectedStudent.last_name} {selectedStudent.suffix}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Current Grade Level
                          </p>
                          <p className="capitalize">
                            {selectedStudent.grade_level}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Current School Year
                          </p>
                          <p>{selectedStudent.school_year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p>{selectedStudent.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 pt-1 gap-4">
                      <div className="space-y-2 col-span-6">
                        <Label htmlFor="gradeLevel">New Grade Level</Label>
                        <Select
                          value={selectedGradeLevel}
                          onValueChange={setSelectedGradeLevel}
                        >
                          <SelectTrigger id="gradeLevel" className="w-full">
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONSTANTS.GRADELEVELS.map((grade) => (
                              <SelectItem
                                className="capitalize"
                                key={grade}
                                value={grade}
                              >
                                {formatDisplayGradeLevel(grade)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 col-span-6">
                        <Label htmlFor="schoolYear">New School Year</Label>
                        <Select
                          value={selectedSchoolYear}
                          onValueChange={setSelectedSchoolYear}
                        >
                          <SelectTrigger id="schoolYear" className="w-full">
                            <SelectValue placeholder="Select school year" />
                          </SelectTrigger>
                          <SelectContent>
                            {schoolYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setActiveTab("fees")}
                    disabled={!selectedStudentId || !selectedGradeLevel}
                  >
                    Next: Fees & Tuition
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fees" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-4">Tuition & Fees</h3>
                  {/* Simplified fee structure for demo */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Tuition Fee</span>
                      <span>₱50,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Miscellaneous Fees</span>
                      <span>₱10,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Books</span>
                      <span>₱5,000.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₱65,000.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("student")}
                  >
                    Back
                  </Button>
                  <Button onClick={handleSubmit}>Complete Enrollment</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
