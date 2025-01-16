import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { sliderMenu } from "@utils/global";

interface State {
  collapsed: boolean;
  sliderMenuItemSelectedKey: string;
}

const initialState: State = {
  collapsed: false,
  sliderMenuItemSelectedKey: 'home',
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
    setSliderMenuItemSelectedKey: (state, action) => {
      state.sliderMenuItemSelectedKey = action.payload;
    },
  },
});

export const { setCollapsed, setSliderMenuItemSelectedKey } = slice.actions;

export default slice.reducer;
