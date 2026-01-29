import { commonApi } from "../common.api";
import { MasterCarBrand } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_MASTER_CAR_BRAND_RESPONSE {
  data: MasterCarBrand[];
  total: number;
}

interface CREATE_CAR_BRAND_RESPONSE {
  message: Text;
  master_car_brand: MasterCarBrand;
}
interface CREATE_CAR_BRAND_PAYLOAD {
  name: string;
  display_name: string;
  sort_order: number;
  active: boolean;
  icon: string
}

interface UPDATE_CAR_BRAND_PAYLOAD {
  id: string;
  name: string;
  display_name: string;
  sort_order: number;
  active: boolean;
  icon: string
}

export const masterCarBrandsApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCarBrands: build.query<GET_MASTER_CAR_BRAND_RESPONSE, void>({
      query: () => ({
        url: `master-car-brands`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createCarBrand: build.mutation<
      CREATE_CAR_BRAND_RESPONSE,
      CREATE_CAR_BRAND_PAYLOAD
    >({
      query: (body) => ({
        url: `master-car-brands`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateCarBrand: build.mutation<
      CREATE_CAR_BRAND_RESPONSE,
      UPDATE_CAR_BRAND_PAYLOAD
    >({
      query: (body) => ({
        url: `master-car-brands/${body.id}`,
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
