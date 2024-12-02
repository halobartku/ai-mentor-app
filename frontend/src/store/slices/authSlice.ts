import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoading: boolean;
  subscription: string | null;
  preferences: Record<string, any>;
}

const initialState: AuthState = {
  isLoading: true,
  subscription: null,
  preferences: {}
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSubscription: (state, action: PayloadAction<string | null>) => {
      state.subscription = action.payload;
    },
    setPreferences: (state, action: PayloadAction<Record<string, any>>) => {
      state.preferences = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Record<string, any>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    }
  }
});

export const {
  setLoading,
  setSubscription,
  setPreferences,
  updatePreferences
} = authSlice.actions;

export default authSlice.reducer;
