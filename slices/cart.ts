import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseItemState } from "@models/item";
import slices from ".";

interface CartItem extends BaseItemState {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<BaseItemState>) => {
      const existingItem = state.items.find(
        (item) => item.item_id === action.payload.item_id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.item_id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.item_id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = slice.actions;

export const selectCartItems = (state: any) => state.cart.items;
export const selectCartItemsCount = (state: any) => 
  state.cart.items.length;
export const selectCartTotal = (state: any) => 
  state.cart.items.reduce((total: number, item: CartItem) => 
    total + Number(item.price) * item.quantity, 0);

export default slice.reducer;