import { commonApi } from "@/common/api";

export const plansApi = {
  list: (params?: any) =>
    commonApi.get("/admin/plans", { params }),

  create: (data: any) =>
    commonApi.post("/admin/plans", data),

  update: (id: string, data: any) =>
    commonApi.put(`/admin/plans/${id}`, data),

  delete: (id: string) =>
    commonApi.delete(`/admin/plans/${id}`)
};