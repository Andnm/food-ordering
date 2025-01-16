import { UserState } from "@models/user";
import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  user_id: null,
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar_url: "",
  role_id: null,
};

type CR<T> = CaseReducer<UserState, PayloadAction<T>>;

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },
    deleteUser: (state) => {
      return initialState;
    },
  },
});

export const { setUserProfile, deleteUser } = slice.actions;
export default slice.reducer;

