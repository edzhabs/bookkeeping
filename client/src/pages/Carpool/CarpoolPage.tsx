import { useState } from "react";
import { LucideSearch, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarpoolTable } from "@/components/carpool-table";
import { CarpoolForm } from "@/components/carpool-form";
import { StudentSelector } from "@/components/student-selector";
import type { Carpool } from "@/types/carpool";
import type { Student } from "@/types/student";
import { logActivity } from "@/lib/activity-logger";

// Sample data for demonstration
const initialCarpools: Carpool[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    route: "North Route",
    driver: "Michael Brown",
    fee: 2000,
    status: "Active",
    paymentStatus: "Paid",
    payments: [
      {
        id: "cp1",
        invoiceNumber: "CAR-2023-001",
        amount: 2000,
        date: "2023-09-10",
        method: "Cash",
        notes: "Monthly payment",
      },
    ],
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Emma Smith",
    route: "East Route",
    driver: "Sarah Wilson",
    fee: 2000,
    status: "Active",
    paymentStatus: "Unpaid",
    payments: [],
  },
  {
    id: "3",
    studentId: "3",
    studentName: "Michael Johnson",
    route: "West Route",
    driver: "David Lee",
    fee: 1800,
    status: "Inactive",
    paymentStatus: "Paid",
    payments: [
      {
        id: "cp2",
        invoiceNumber: "CAR-2023-003",
        amount: 1800,
        date: "2023-08-15",
        method: "Bank Transfer",
        notes: "Final payment",
      },
    ],
  },
];

// Sample students data
const sampleStudents: Student[] = [
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
    parents: {
      mother: {
        fullName: "Sarah Smith",
        job: "Teacher",
        educationAttainment: "Master's Degree",
      },
    },
  },
];

export default function CarpoolPage() {
  const [carpools, setCarpools] = useState<Carpool[]>(initialCarpools);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  // const [isCreateCarpoolOpen, setIsCreateCarpoolOpen] = useState(false);
  const [selectedCarpool, setSelectedCarpool] = useState<Carpool | null>(null);
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCarpools = carpools.filter(
    (carpool) =>
      carpool.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carpool.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carpool.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carpool.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayment = (carpoolId: string, method: string, notes: string) => {
    setCarpools((prevCarpools) =>
      prevCarpools.map((carpool) => {
        if (carpool.id === carpoolId) {
          // Generate a new invoice number
          const invoiceNumber = `CAR-${new Date().getFullYear()}-${String(
            Math.floor(Math.random() * 900) + 100
          )}`;

          const newPayment = {
            id: `cp${Date.now()}`,
            invoiceNumber,
            amount: carpool.fee,
            date: new Date().toISOString().split("T")[0],
            method,
            notes,
          };

          const updatedCarpool = {
            ...carpool,
            paymentStatus: "Paid",
            payments: [...(carpool.payments || []), newPayment],
          };

          logActivity({
            action: "Updated",
            entityType: "Carpool",
            entityId: carpoolId,
            details: `Payment of ₱${carpool.fee} made via ${method}. Invoice #${invoiceNumber} generated.`,
          });

          return updatedCarpool;
        }
        return carpool;
      })
    );
    setIsPaymentFormOpen(false);
    setSelectedCarpool(null);
  };

  const handleCreateCarpool = (data: {
    studentId: string;
    route: string;
    driver: string;
    fee: number;
    status: "Active" | "Inactive";
  }) => {
    const student = sampleStudents.find((s) => s.id === data.studentId);
    if (!student) return;

    const newCarpool: Carpool = {
      id: `c${Date.now()}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      route: data.route,
      driver: data.driver,
      fee: data.fee,
      status: data.status,
      paymentStatus: "Unpaid",
      payments: [],
    };

    setCarpools([...carpools, newCarpool]);
    logActivity({
      action: "Created",
      entityType: "Carpool",
      entityId: newCarpool.id,
      details: `Created carpool record for ${student.firstName} ${student.lastName} on ${data.route} route`,
    });

    setIsCreateCarpoolOpen(false);
    // setSelectedStudent(null);
  };

  const openPaymentForm = (carpool: Carpool) => {
    setSelectedCarpool(carpool);
    setIsPaymentFormOpen(true);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentSelectorOpen(false);
    setIsCreateCarpoolOpen(true);
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Carpool Management</h1>
        <Button onClick={() => setIsStudentSelectorOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Carpool Record
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Carpool Records</CardTitle>
          <CardDescription>
            View and manage student carpool arrangements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search carpools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon={<LucideSearch className="h-4 w-4" />}
            />
          </div>
          <CarpoolTable
            carpools={filteredCarpools}
            onPayClick={openPaymentForm}
          />
        </CardContent>
      </Card>

      {selectedCarpool && (
        <CarpoolForm
          isOpen={isPaymentFormOpen}
          onClose={() => {
            setIsPaymentFormOpen(false);
            setSelectedCarpool(null);
          }}
          carpool={selectedCarpool}
          onSubmit={handlePayment}
        />
      )}

      <StudentSelector
        isOpen={isStudentSelectorOpen}
        onClose={() => setIsStudentSelectorOpen(false)}
        students={sampleStudents}
        onSelect={handleStudentSelect}
      />

      {/* {selectedStudent && (
        <CreateCarpoolForm
          isOpen={isCreateCarpoolOpen}
          onClose={() => {
            setIsCreateCarpoolOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          onSubmit={handleCreateCarpool}
        />
      )} */}
    </div>
  );
}
