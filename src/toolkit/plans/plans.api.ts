import { commonApi } from "../common.api";
import type { Plan } from "@/types";

export interface PlanPayload {
  plan_id?: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  features: string[]; // ✅ FIXED
  trial_period_days: string | null;
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
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Plans"], // ✅ add this
}),

deletePlan: builder.mutation<void, string>({
  query: (id) => ({
    url: `/plans/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Plans"], // ✅ add this
}),


  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;