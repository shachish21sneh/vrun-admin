import { configureStore } from "@reduxjs/toolkit";
import { commonApi } from "@/toolkit/common.api";

export const store = configureStore({
  reducer: {
    [commonApi.reducerPath]: commonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(commonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;