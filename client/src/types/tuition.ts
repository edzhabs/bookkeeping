export interface Payment {
  id: string
  invoiceNumber: string
  amount: number
  date: string
  method: string
  notes?: string
  reservationFee: number
  tuitionFee: number
  advancePayment: number
}

export interface Tuition {
  id: string
  studentId: string
  studentName: string
  gradeLevel: string
  discount: string
  discountAmount: number
  schoolYear: string
  totalAmount: number
  remainingBalance: number
  dueDate: string
  status: "Paid" | "Unpaid" | "Partial"
  payments: Payment[]
}
