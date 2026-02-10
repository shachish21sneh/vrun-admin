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
      query: () => "/admin/plans",
      providesTags: ["Plans"]
    }),

    createPlan: builder.mutation<void, PlanPayload>({
      query: (body) => ({
        url: "/admin/plans",
        method: "POST",
        body
      }),
      invalidatesTags: ["Plans"]
    }),

    updatePlan: builder.mutation<
      void,
      { id: string; data: PlanPayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/plans/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Plans"]
    }),

    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/plans/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Plans"]
    })
  })
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation
} = plansApi;