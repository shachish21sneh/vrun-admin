import { commonApi } from "../common.api";
import { UserType, TokenType } from "@/common/types/auth.types";
import { setCookie } from "cookies-next";
import dayjs from "dayjs";
import { V_AUTH_TOKEN, V_REFRESH_TOKEN } from "@/constants/stringConstants";
type ErrorResponse = {
  error: string;
};

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: UserType;
  access_token: TokenType;
}

export const authenticationApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    authLoginWithPassword: build.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: `auth/login-with-password`,
        method: "POST",
        body,
      }),
      onQueryStarted: async (_body, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const maxAge = dayjs(data.access_token.expires_at).diff(
            dayjs(),
            "second"
          );
          setCookie(V_AUTH_TOKEN, data.access_token.token, {
            maxAge,
            path: "/",
          });
          setCookie(V_REFRESH_TOKEN, data.access_token.refresh_token);
        } catch (error) {
          console.log(error);
        }
      },
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});
