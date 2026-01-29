import { commonApi } from "../common.api";
import { Banner } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_BANNERS_RESPONSE {
  data: Banner[];
  total: number;
}

interface CREATE_BANNER_RESPONSE {
  message: Text;
  master_car_brand: Banner;
}
interface CREATE_BANNERS_PAYLOAD {
  title: string;
  image_url: string;
  sort_order: number;
  start_date: string;
  end_date: string;
}

interface UPDATE_BANNER_PAYLOAD {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
  start_date: string;
  end_date: string;
}

export const bannersApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllBanners: build.query<GET_BANNERS_RESPONSE, void>({
      query: () => ({
        url: `banners`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createBanner: build.mutation<
      CREATE_BANNER_RESPONSE,
      CREATE_BANNERS_PAYLOAD
    >({
      query: (body) => ({
        url: `banners`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateBanner: build.mutation<
      CREATE_BANNER_RESPONSE,
      UPDATE_BANNER_PAYLOAD
    >({
      query: (body) => ({
        url: `banners/${body.id}`,
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
