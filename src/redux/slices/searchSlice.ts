import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, SearchFilters } from '@/types/company';

interface SearchState {
  filters: SearchFilters;
  results: Company[];
  total: number;
  page: number;
  loading: boolean;
  aiSuggestions: string[]; // ✅ NEW
}

const initialState: SearchState = {
  filters: {
    query: '', // ✅ REQUIRED (backend expects it)
    sector: '',
    subSector: '',
    location: '',
    tags: [],
  },
  results: [],
  total: 0,
  page: 1,
  loading: false,
  aiSuggestions: [], // ✅ NEW
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /**
     * 🔥 Update filters (triggers new search)
     */
    setFilters(state, action: PayloadAction<Partial<SearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // reset pagination
    },

    /**
     * 🔥 Set search results
     */
    setResults(
      state,
      action: PayloadAction<{ results: Company[]; total: number }>
    ) {
      state.results = action.payload.results;
      state.total = action.payload.total;
    },

    /**
     * 🔥 Store AI suggestions
     */
    setAiSuggestions(state, action: PayloadAction<string[]>) {
      state.aiSuggestions = action.payload;
    },

    /**
     * 🔥 Pagination
     */
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },

    /**
     * 🔥 Loading state
     */
    setSearchLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    /**
     * 🔥 Remove single tag
     */
    removeFilterTag(state, action: PayloadAction<string>) {
      state.filters.tags = (state.filters.tags || []).filter(
        (tag) => tag !== action.payload
      );
    },

    /**
     * 🔥 Replace all tags
     */
    setFilterTags(state, action: PayloadAction<string[]>) {
      state.filters.tags = action.payload;
    },

    /**
     * 🔥 Clear all filters (useful for reset)
     */
    resetFilters(state) {
      state.filters = {
        query: '',
        sector: '',
        subSector: '',
        location: '',
        tags: [],
      };
      state.page = 1;
      state.results = [];
      state.total = 0;
      state.aiSuggestions = [];
    },
  },
});

export const {
  setFilters,
  setResults,
  setPage,
  setSearchLoading,
  removeFilterTag,
  setFilterTags,
  setAiSuggestions, // ✅ NEW
  resetFilters,     // ✅ NEW
} = searchSlice.actions;

export default searchSlice.reducer;