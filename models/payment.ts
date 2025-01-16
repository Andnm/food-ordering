import { OrderDetail } from "./order";

export interface PaymentState {
  user_id: number;
  total: number;
  note: string;
  details: OrderDetail[];
}
