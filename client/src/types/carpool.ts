export interface Carpool {
  id: string
  invoiceNumber: string
  studentName: string
  route: string
  driver: string
  fee: number
  status: "Active" | "Inactive"
  paymentStatus: "Paid" | "Unpaid"
  paymentDate: string | null
}
