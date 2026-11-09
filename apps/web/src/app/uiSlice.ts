import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  isSidebarPinned: boolean;
};

const initialState: UiState = {
  isSidebarPinned: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarPinned(state) {
      state.isSidebarPinned =!state.isSidebarPinned;
    },
    setSidebarPinned(state, action: { payload: boolean }) {
      state.isSidebarPinned = action.payload;
    }
  },
});

export const { toggleSidebarPinned, setSidebarPinned } = uiSlice.actions;

export default uiSlice.reducer;
