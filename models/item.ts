export interface ItemIdState {
  item_id: number;
}

export interface BaseItemState extends ItemIdState {
  item_name: string;
  price: string;
  category: string;
  description: string;
  availability: number;
  image_url: string;
}

export type CreateItemState = Omit<BaseItemState, "item_id">;
