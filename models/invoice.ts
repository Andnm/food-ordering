import { OrderInfo } from "./order";
import { PaymentState } from "./payment";

export interface InvoiceState {
  invoice_date: string;
  invoice_id: number;
  order_id: number;
  order: OrderState;
  payment: PaymentState;
}

interface OrderState extends OrderInfo {
  customer: CustomerState;
}

interface CustomerState {
  address: string;
  name: string;
  phone: string;
}
