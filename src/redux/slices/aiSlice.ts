import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AiMessage } from '@/types/company';

interface AiState {
  messages: AiMessage[];
  loading: boolean;
}

const initialState: AiState = {
  messages: [
    {
      role: 'assistant',
      content: 'Tell me what type of companies you are looking for.',
    },
  ],
  loading: false,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<AiMessage>) {
      state.messages.push(action.payload);
    },
    setAiLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearMessages(state) {
      state.messages = initialState.messages;
    },
  },
});

export const { addMessage, setAiLoading, clearMessages } = aiSlice.actions;
export default aiSlice.reducer;
