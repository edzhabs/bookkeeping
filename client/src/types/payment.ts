export interface Payment {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
  reservationFee: number;
  tuitionFee: number;
  advancePayment: number;
}

interface OtherPaymentItem {
  category: string;
  amount: number;
  remarks?: string;
}

export interface OtherPaymentBody {
  enrollment_id: string;
  payment_method: "cash" | "g-cash" | "bank";
  payment_date: string;
  invoice_number: string;
  notes: string;
  items: OtherPaymentItem[];
}

export interface IPaymentsID {
  id: string;
  invoice_number: string;
  payment_date: string;
  category: string[];
  amount: string;
  payment_method: "cash" | "g-cash" | "bank";
  notes: string;
}
