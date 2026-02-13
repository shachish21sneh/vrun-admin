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
        url: `api/merchant`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createMerchants: build.mutation<
      CREATE_MERCHANT_RESPONSE,
      CREATE_MERCHANT_PAYLOAD
    >({
      query: (body) => ({
        url: `api/merchant`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getMerchantDetails: build.query<Merchant, { id: string }>({
      query: (body) => ({
        url: `api/merchant/${body.id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});
