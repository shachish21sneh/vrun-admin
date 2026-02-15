/* eslint-disable @typescript-eslint/no-explicit-any */

import { commonApi } from "../common.api";
import { Merchant, ContactPerson } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_MERCHANT_RESPONSE {
  data: Merchant[];
}

interface CREATE_MERCHANT_RESPONSE {
  message: string;
  testimonial: Merchant;
}

/* ---------------------------
   CREATE PAYLOAD (REQUIRED)
----------------------------*/
export interface CREATE_MERCHANT_PAYLOAD {
  business_name: string;
  business_email: string;
  business_phone: string;
  latitude: number;
  longitude: number;
  full_address: string;
  city?: string;
  state?: string;
  contact_persons?: ContactPerson[];
  brands: string[];
  working_days: string[];
  holidays?: string[];
  image_url?: string;
  active?: boolean;
  password: string;
}

/* ---------------------------
   UPDATE PAYLOAD (PARTIAL)
----------------------------*/
export interface UPDATE_MERCHANT_PAYLOAD {
  id: string;
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  latitude?: number;
  longitude?: number;
  full_address?: string;
  city?: string;
  state?: string;
  contact_persons?: ContactPerson[];
  brands?: string[];
  working_days?: string[];
  holidays?: string[];
  image_url?: string;
  active?: boolean;
  // ❌ password removed intentionally
}

export const merchantsApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    /* ---------------------------
       GET ALL
    ----------------------------*/
    getAllMerchants: build.query<GET_MERCHANT_RESPONSE, void>({
      query: () => ({
        url: `merchant`,
      }),
      providesTags: ["Merchants"],
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),

    /* ---------------------------
       CREATE
    ----------------------------*/
    createMerchants: build.mutation<
      CREATE_MERCHANT_RESPONSE,
      CREATE_MERCHANT_PAYLOAD
    >({
      query: (body) => ({
        url: `merchant`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Merchants"],
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),

    /* ---------------------------
       GET BY ID
    ----------------------------*/
    getMerchantDetails: build.query<Merchant, { id: string }>({
      query: ({ id }) => ({
        url: `merchant/${id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),

    /* ---------------------------
       UPDATE STATUS
    ----------------------------*/
    updateMerchantStatus: build.mutation<
      { message: string },
      { id: string; active: boolean }
    >({
      query: ({ id, active }) => ({
        url: `merchant/${id}/status`,
        method: "PATCH",
        body: { active },
      }),
      invalidatesTags: ["Merchants"],
    }),

    /* ---------------------------
       UPDATE MERCHANT (FIXED)
    ----------------------------*/
    updateMerchant: build.mutation<
      { message: string },
      UPDATE_MERCHANT_PAYLOAD
    >({
      query: ({ id, ...body }) => ({
        url: `merchant/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Merchants"],
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllMerchantsQuery,
  useCreateMerchantsMutation,
  useGetMerchantDetailsQuery,
  useUpdateMerchantStatusMutation,
  useUpdateMerchantMutation,
} = merchantsApi;