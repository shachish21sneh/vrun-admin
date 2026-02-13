import { commonApi } from "../common.api";
import type { Plan } from "@/types";

export interface PlanPayload {
  plan_id?: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  features: string[];
  trial_period_days: number;
  status: string;
  sunroof_type: string;
}

export const plansApi = commonApi.injectEndpoints({
  endpoints: (builder) => ({

    getPlans: builder.query<Plan[], void>({
      query: () => "/plans",
      providesTags: ["Plans"],
    }),

    createPlan: builder.mutation<void, PlanPayload>({
      query: (body) => ({
        url: "/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),

    updatePlan: builder.mutation<
  void,
  { id: string; data: PlanPayload }
>({
  query: ({ id, data }) => ({
    url: `/plans/${id}`,
    method: "PATCH",
    body: data,
  }),
  invalidatesTags: ["Plans"],
}),

    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),

  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;