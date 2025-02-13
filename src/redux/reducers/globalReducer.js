import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collapsed: false,
  sliderMenuItemSelectedKey: "home",
};

const globalSlice = createSlice({
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
  extraReducers: (builder) => {},
});

export const { setCollapsed, setSliderMenuItemSelectedKey } =
  globalSlice.actions;

export default globalSlice.reducer;
