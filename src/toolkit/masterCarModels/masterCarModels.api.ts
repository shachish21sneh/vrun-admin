import { commonApi } from "../common.api";
import { MasterCarModel } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_MASTER_CAR_MODEL_RESPONSE {
  data: MasterCarModel[];
  total: number;
}

interface CREATE_CAR_MODEL_RESPONSE {
  message: Text;
  master_car_model: MasterCarModel;
}
interface CREATE_CAR_MODEL_PAYLOAD {
  name: string;
  display_name: string;
  sort_order: number;
  car_brand_id: string;
  active: boolean;
  icon: string
}

interface UPDATE_CAR_MODEL_PAYLOAD {
  id: string;
  name: string;
  display_name: string;
  sort_order: number;
  car_brand_id: string;
  active: boolean;
  icon: string
}

export const masterCarModelApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCarModels: build.query<
      GET_MASTER_CAR_MODEL_RESPONSE,
      { limit: number; offset: number; query: string }
    >({
      query: (body) => ({
        url: `master-car-models?limit=${body.limit}&offset=${body.offset}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createCarModel: build.mutation<
      CREATE_CAR_MODEL_RESPONSE,
      CREATE_CAR_MODEL_PAYLOAD
    >({
      query: (body) => ({
        url: `master-car-models`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateCarModel: build.mutation<
      CREATE_CAR_MODEL_RESPONSE,
      UPDATE_CAR_MODEL_PAYLOAD
    >({
      query: (body) => ({
        url: `master-car-models/${body.id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});
