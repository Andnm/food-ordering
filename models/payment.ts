import { OrderDetail } from "./order";

export interface CreatePaymentState {
  user_id: number;
  total: number;
  note: string;
  details: OrderDetail[];
}

export interface PaymentState {
  payment_id: number;
  payment_method: string;
  payment_status: string;
  payment_date: string;
}
