import { commonApi } from "../common.api";
import { Customer, UserCar, UserAddresses } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_ALL_CUSTOMERS_RESPONSE {
  data: Customer[];
  total: number;
}

interface GET_CUSTOMER_RESPONSE {
  profile: Customer;
  cars: UserCar[];
  user_locations: UserAddresses[];
  attachments: [];
  tickets: [];
}

export interface UPDATE_PASSWORD_PAYLOAD {
  old_password: string;
  new_password: string;
}

interface UPDATE_PROFILE_PAYLOAD {
  first_name: string;
  last_name: string;
  image_url: string;
}

export const customersApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query<
      GET_ALL_CUSTOMERS_RESPONSE,
      { limit: number; offset: number; query: string }
    >({
      query: (body) => ({
        url: `users?limit=${body.limit}&offset=${body.offset}&query=${body.query}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getCustomerDetails: build.query<GET_CUSTOMER_RESPONSE, { id: string }>({
      query: (body) => ({
        url: `users/${body.id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updatePassword: build.mutation<void, UPDATE_PASSWORD_PAYLOAD>({
      query: (body) => ({
        url: `/auth/update-password`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateProfile: build.mutation<void, UPDATE_PROFILE_PAYLOAD>({
      query: (body) => ({
        url: `/users/profile`,
        method: "PATCH",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});
