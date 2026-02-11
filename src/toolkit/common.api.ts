import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import { V_AUTH_TOKEN } from "@/constants/stringConstants";

type RejectedAction = {
  payload?: {
    status: number;
  };
};

export const commonApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    mode: "cors",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
  const token = getCookie(V_AUTH_TOKEN);

  console.log("AUTH TOKEN FROM COOKIE:", token);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
},
  }),
  tagTypes: ["User", "Datasets", "Tasks", "Models", "Plans"],
  endpoints: () => ({}),
});

export const commonApiAuthMiddleware: Middleware =
  () => (next) => (action: unknown) => {
    if (isRejectedWithValue(action)) {
      if ((action as RejectedAction)?.payload?.status === 401) {
        // api.dispatch(logout());
      }
    }
    return next(action);
  };