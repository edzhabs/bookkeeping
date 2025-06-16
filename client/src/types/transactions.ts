export interface TransactionTable {
  id: string;
  invoice_number: string;
  full_name: string;
  category: string[];
  payment_date: string;
  amount: string;
  payment_method: "cash" | "g-cash" | "bank";
}
