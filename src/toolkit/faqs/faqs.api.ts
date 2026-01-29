import { commonApi } from "../common.api";
import { Faq } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_FAQS_RESPONSE {
  data: Faq[];
}

interface CREATE_FAQS_RESPONSE {
  message: Text;
  faq: Faq;
}

interface CREATE_FAQS_PAYLOAD {
  title: string;
  content: string;
  sort_order: number;
  active: boolean;
}

interface UPDATE_FAQS_PAYLOAD {
  id: string;
  title?: string;
  content?: string;
  sort_order?: number;
  active?: boolean;
}

export const faqsApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllFaqs: build.query<GET_FAQS_RESPONSE, void>({
      query: () => ({
        url: `faqs`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createFaq: build.mutation<CREATE_FAQS_RESPONSE, CREATE_FAQS_PAYLOAD>({
      query: (body) => ({
        url: `faqs`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateFaq: build.mutation<CREATE_FAQS_RESPONSE, UPDATE_FAQS_PAYLOAD>({
      query: (body) => ({
        url: `faqs/${body.id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    deleteFaq: build.mutation<CREATE_FAQS_RESPONSE, UPDATE_FAQS_PAYLOAD>({
      query: (body) => ({
        url: `faqs/${body.id}`,
        method: "DELETE",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});
