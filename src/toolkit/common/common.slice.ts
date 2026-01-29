import { createSlice } from "@reduxjs/toolkit";
import { UserType, TokenType } from "@/common/types/auth.types";
export interface CommonStateType {
  token: TokenType | null;
  user: UserType | null;
}

const initialState: CommonStateType = {
  token: null,
  user: null,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.data.user;
      state.token = action.payload.data.access_token.token;
    },
    resetCommonState() {
      return initialState;
    },
  },
});

export const commonState = (state: { common: CommonStateType }) => state.common;
export const { setUser, resetCommonState } = commonSlice.actions;
export default commonSlice.reducer;
