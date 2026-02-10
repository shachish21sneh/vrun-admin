import { commonApi } from "../common.api";
import type { Plan } from "@/types";

export interface PlanPayload {
  name: string;
  price: number;
  duration: number;
  description: string;
  features: string[];
  sortOrder: number;
  isActive: boolean;
  isPopular: boolean;
}

export interface PlansListResponse {
  data: Plan[];
}

export const plansApi = commonApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<PlansListResponse, void>({
      query: () => "/plans"
    }),

    createPlan: builder.mutation<void, PlanPayload>({
      query: (body) => ({
        url: "/plans",
        method: "POST",
        body
      })
    }),

    updatePlan: builder.mutation<
      void,
      { id: string; data: PlanPayload }
    >({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: "PUT",
        body: data
      })
    }),

    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE"
      })
    })
  })
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation
} = plansApi;