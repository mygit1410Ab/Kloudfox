import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access: null,
  refresh: null,
  lastUpdated: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      const { access, refresh } = action.payload;
      state.access = access;
      state.refresh = refresh;
      state.lastUpdated = Date.now();
    },
    clearTokens: (state) => {
      state.access = null;
      state.refresh = null;
      state.lastUpdated = null;
    },
    updateAccessToken: (state, action) => {
      state.access = action.payload;
      state.lastUpdated = Date.now();
    },
  },
});

export const { setTokens, clearTokens, updateAccessToken } = tokenSlice.actions;
export default tokenSlice.reducer;
