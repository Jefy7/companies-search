import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, SearchFilters } from '@/types/company';

interface SearchState {
  filters: SearchFilters;
  results: Company[];
  total: number;
  page: number;
  loading: boolean;
}

const initialState: SearchState = {
  filters: {
    tags: [],
  },
  results: [],
  total: 0,
  page: 1,
  loading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<SearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setResults(state, action: PayloadAction<{ results: Company[]; total: number }>) {
      state.results = action.payload.results;
      state.total = action.payload.total;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearchLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    removeFilterTag(state, action: PayloadAction<string>) {
      state.filters.tags = (state.filters.tags || []).filter((tag) => tag !== action.payload);
    },
    setFilterTags(state, action: PayloadAction<string[]>) {
      state.filters.tags = action.payload;
    },
  },
});

export const { setFilters, setResults, setPage, setSearchLoading, removeFilterTag, setFilterTags } = searchSlice.actions;
export default searchSlice.reducer;
