import { commonApi } from "../common.api";
import { Merchant, ContactPerson } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_MERCHANT_RESPONSE {
  data: Merchant[];
}

interface CREATE_MERCHANT_RESPONSE {
  message: Text;
  testimonial: Merchant;
}

interface CREATE_MERCHANT_PAYLOAD {
  business_name: string;
  business_email: string;
  business_phone: string;
  latitude: number;
  longitude: number;
  full_address: string;
  city: string;
  state: string;
  contact_persons: ContactPerson[];
  brands: string[];
  working_days: string[];
  image_url: string;
  active: boolean;
  password: string;
}

export const merchantsApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMerchants: build.query<GET_MERCHANT_RESPONSE, void>({
  query: () => ({
    url: `merchant`,
  }),
  providesTags: ["Merchants"],   // 👈 ADD THIS
  transformErrorResponse: (response) => {
    return (response?.data as unknown as ErrorResponse)?.error;
  },
}),
    createMerchants: build.mutation<
      CREATE_MERCHANT_RESPONSE,
      CREATE_MERCHANT_PAYLOAD
    >({
      query: (body) => ({
        url: `merchant`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getMerchantDetails: build.query<Merchant, { id: string }>({
      query: (body) => ({
        url: `merchant/${body.id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
	
	updateMerchantStatus: build.mutation<
  { message: string },
  { id: string; active: boolean }
>({
  query: ({ id, active }) => ({
    url: `merchant/${id}/status`,
    method: "PATCH",
    body: { active },
  }),
  invalidatesTags: ["Merchants"],  // 👈 IMPORTANT
}),
	
  }),
  overrideExisting: true,
});


export const {
  useGetAllMerchantsQuery,
  useCreateMerchantsMutation,
  useGetMerchantDetailsQuery,
  useUpdateMerchantStatusMutation,   // 👈 ADD THIS
} = merchantsApi;