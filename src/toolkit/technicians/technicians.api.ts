import { commonApi } from "../common.api";
import { Technician } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_TECHNICIAN_RESPONSE {
  data: Technician[];
}

interface CREATE_TECHNICIAN_RESPONSE {
  message: Text;
  testimonial: Technician;
}

interface CREATE_TECHNICIAN_PAYLOAD {
  name: string;
  email: string;
  phone: string;
  merchant_id: string;
  // active: boolean;
  // availability_status: string;
}

interface UPDATE_TECHNICIAN_PAYLOAD {
  id: string;
  name: string;
  email: string;
  phone: string;
  merchant_id: string;
  active: boolean;
  availability_status: string;
}

export const techniciansApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTechnicians: build.query<GET_TECHNICIAN_RESPONSE, void>({
      query: () => ({
        url: `technicians`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createTechnicians: build.mutation<
      CREATE_TECHNICIAN_RESPONSE,
      CREATE_TECHNICIAN_PAYLOAD
    >({
      query: (body) => ({
        url: `technicians`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateTechnicians: build.mutation<
      CREATE_TECHNICIAN_RESPONSE,
      UPDATE_TECHNICIAN_PAYLOAD
    >({
      query: (body) => ({
        url: `technicians/${body.id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getTechniciansDetails: build.query<Technician, { id: string }>({
      query: (body) => ({
        url: `technicians/${body.id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getTechniciansByMerchant: build.query<
      GET_TECHNICIAN_RESPONSE,
      { merchant_id: string }
    >({
      query: (params) => ({
        url: `technicians?merchant_id=${params?.merchant_id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});
