import { LucidePlus, LucideSearch } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { EnrollmentTable } from "@/components/enrollment-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NAVTITLE } from "@/constants/side-menu";
import { HeaderContext } from "@/context/headerContext";
import type { Student } from "@/types/student";
import { useNavigate } from "react-router-dom";

// Sample data for demonstration
const initialStudents: Student[] = [
  {
    id: "1",
    firstName: "John",
    middleName: "Robert",
    lastName: "Doe",
    gender: "Male",
    birthdate: "2010-05-15",
    schoolYear: "2023-2024",
    suffix: "",
    livingWith: "Both Parents",
    discount: "None",
    discountPercentage: 0,
    gradeLevel: "Grade 10",
    parents: {
      father: {
        fullName: "Robert Doe",
        job: "Engineer",
        educationAttainment: "Bachelor's Degree",
      },
      mother: {
        fullName: "Jane Doe",
        job: "Doctor",
        educationAttainment: "Doctorate",
      },
    },
  },
  {
    id: "2",
    firstName: "Emma",
    middleName: "Grace",
    lastName: "Smith",
    gender: "Female",
    birthdate: "2011-08-22",
    schoolYear: "2023-2024",
    suffix: "",
    livingWith: "Mother",
    discount: "Sibling Discount",
    discountPercentage: 10,
    gradeLevel: "Grade 8",
    parents: {
      mother: {
        fullName: "Sarah Smith",
        job: "Teacher",
        educationAttainment: "Master's Degree",
      },
    },
  },
];

export default function EnrollmentPage() {
  const header = useContext(HeaderContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Tuition" | "Carpool">(
    "All"
  );

  useEffect(() => {
    header.setHeaderTitle(NAVTITLE.ENROLLMENTS.title);
  }, [header]);

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.schoolYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStudent = (student: Student) => {
    navigate(`/enrollment/${student.id}/edit`);
    console.log("edit");
  };

  const handleViewStudent = (student: Student) => {
    navigate(`/enrollment/${student.id}`);
    console.log("view");
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((student) => student.id !== studentId));
  };

  return (
    <>
      <Button
        className="w-full sm:w-[180px]"
        onClick={() => navigate(NAVTITLE.ENROLL_STUDENT.url)}
      >
        <LucidePlus className="mr-2 h-4 w-4" />
        Enroll Student
      </Button>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-[300px]">
          <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        {/* Filter Dropdown */}
        <Select
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "All" | "Tuition" | "Carpool")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Transactions</SelectItem>
            <SelectItem value="Tuition">Tuition Payments</SelectItem>
            <SelectItem value="Carpool">Carpool Payments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <EnrollmentTable
        students={filteredStudents}
        onEdit={handleEditStudent}
        onView={handleViewStudent}
        onDelete={handleDeleteStudent}
      />
    </>
  );
}
