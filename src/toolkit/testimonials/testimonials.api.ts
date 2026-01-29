import { commonApi } from "../common.api";
import { Testimonial } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_TESTIMONIALS_RESPONSE {
  data: Testimonial[];
}

interface CREATE_TESTIMONIALS_RESPONSE {
  message: Text;
  testimonial: Testimonial;
}

interface CREATE_TESTIMONIALS_PAYLOAD {
  review: string;
  rating: number;
  image: string;
  name: string;
  designation: string;
  company: string;
  sort_order: number;
  active: boolean;
}

interface UPDATE_TESTIMONIALS_PAYLOAD {
  id: string;
  review?: string;
  rating?: number;
  image?: string;
  name?: string;
  designation?: string;
  company?: string;
  sort_order?: number;
  active?: boolean;
}

export const testimonialsApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTestimonials: build.query<GET_TESTIMONIALS_RESPONSE, void>({
      query: () => ({
        url: `testimonials`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createTestimonials: build.mutation<
      CREATE_TESTIMONIALS_RESPONSE,
      CREATE_TESTIMONIALS_PAYLOAD
    >({
      query: (body) => ({
        url: `testimonials`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateTestimonials: build.mutation<
      CREATE_TESTIMONIALS_RESPONSE,
      UPDATE_TESTIMONIALS_PAYLOAD
    >({
      query: (body) => ({
        url: `testimonials/${body.id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    deleteTestimonials: build.mutation<
      CREATE_TESTIMONIALS_RESPONSE,
      UPDATE_TESTIMONIALS_PAYLOAD
    >({
      query: (body) => ({
        url: `testimonials/${body.id}`,
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
