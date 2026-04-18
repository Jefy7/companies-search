import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isFilterOpen: boolean;
  isChatOpen: boolean;
}

const initialState: UiState = {
  isFilterOpen: true,
  isChatOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilterOpen(state, action: PayloadAction<boolean>) {
      state.isFilterOpen = action.payload;
    },
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.isChatOpen = action.payload;
    },
  },
});

export const { setFilterOpen, setChatOpen } = uiSlice.actions;
export default uiSlice.reducer;
