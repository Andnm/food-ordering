export interface OrderIdState {
  order_id: number;
}

export interface OrderBaseState {
  status: number;
  note: string;
  details: OrderDetail[];
}

export interface OrderState {
  note: string;
  order_date: string;
  order_id: number;
  status: number;
  total: string;
  user_id: number;
}

export interface OrderInfo extends OrderState {
  details?: OrderItem[];
}

export interface OrderItem {
  item_id: number;
  item_name: string;
  quantity: number;
  price: string;
  image_url: string;
}

export interface OrderDetail {
  item_id: number;
  quantity: number;
}

export interface CancelOrderState extends OrderIdState {
  note: string;
}

export interface CreateOrderState extends OrderBaseState {
  user_id: number;
}
