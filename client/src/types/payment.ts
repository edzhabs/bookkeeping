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
