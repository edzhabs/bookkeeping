import { Eye, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/types/student";
import type { ActivityLogItem } from "@/types/activity-log";

interface EnrollmentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onView: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

type SortField = "name" | "gender" | "birthdate" | "schoolYear" | "discount";
type SortDirection = "asc" | "desc";

// Sample activity logs for students
const sampleStudentLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Student",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Created student record for John Doe",
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
  {
    id: "3",
    action: "Viewed",
    entityType: "Student",
    entityId: "2",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Viewed student details",
  },
];

export function EnrollmentTable({
  students,
  onEdit,
  onView,
  onDelete,
}: EnrollmentTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<"students" | "activity">(
    "students"
  );

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      onDelete(selectedStudent.id);
      setIsDeleteOpen(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case "gender":
          aValue = a.gender;
          bValue = b.gender;
          break;
        case "birthdate":
          aValue = new Date(a.birthdate).getTime();
          bValue = new Date(b.birthdate).getTime();
          break;
        case "schoolYear":
          aValue = a.schoolYear;
          bValue = b.schoolYear;
          break;
        case "discount":
          aValue = a.discount || "None";
          bValue = b.discount || "None";
          break;
        default:
          return 0;
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [students, sortField, sortDirection]);

  // Calculate pagination
  const pageCount = Math.ceil(sortedStudents.length / pageSize);
  const paginatedStudents = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return sortedStudents.slice(start, end);
  }, [sortedStudents, pageIndex, pageSize]);

  // Reset to first page when sorting changes
  const handleSortWithReset = (field: SortField) => {
    handleSort(field);
    setPageIndex(0);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  // Filter activity logs for students
  const filteredActivityLogs = sampleStudentLogs.filter((log) => {
    return students.some((student) => student.id === log.entityId);
  });

  return (
    <>
      <div className="rounded-md border w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortWithReset("name")}
              >
                Name {renderSortIcon("name")}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSortWithReset("gender")}
              >
                Gender {renderSortIcon("gender")}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSortWithReset("birthdate")}
              >
                Birthdate {renderSortIcon("birthdate")}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSortWithReset("schoolYear")}
              >
                School Year {renderSortIcon("schoolYear")}
              </TableHead>
              <TableHead
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSortWithReset("discount")}
              >
                Discount {renderSortIcon("discount")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <button
                      onClick={() => onView(student)}
                      className="hover:underline text-left font-medium"
                    >
                      {student.firstName}{" "}
                      {student.middleName
                        ? student.middleName.charAt(0) + ". "
                        : ""}
                      {student.lastName} {student.suffix}
                    </button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.gender}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(student.birthdate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.schoolYear}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.discount || "None"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Desktop view buttons */}
                      <div className="hidden sm:flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onView(student)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(student)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(student)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>

                      {/* Mobile view dropdown */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(student)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(student)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(student)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        totalItems={sortedStudents.length}
        onPageChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />

      {selectedStudent && (
        <DeleteConfirmation
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Student"
          description={`Are you sure you want to delete ${selectedStudent.firstName} ${selectedStudent.lastName}? This action cannot be undone.`}
        />
      )}
    </>
  );
}
