import { commonApi } from "@/common/api";
import { Plan } from "@/types";

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

export const plansApi = {
  list: () =>
    commonApi.get<PlansListResponse>("/admin/plans"),

  create: (data: PlanPayload) =>
    commonApi.post("/admin/plans", data),

  update: (id: string, data: PlanPayload) =>
    commonApi.put(`/admin/plans/${id}`, data),

  delete: (id: string) =>
    commonApi.delete(`/admin/plans/${id}`)
};