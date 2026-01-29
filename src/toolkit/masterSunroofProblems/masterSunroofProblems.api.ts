import { commonApi } from "../common.api";
import { MasterSunroofProblem } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_MASTER_SUNROOF_PROBLEMS_RESPONSE {
  data: MasterSunroofProblem[];
  total: number;
}

interface CREATE_SUNROOF_PROBLEMS_RESPONSE {
  message: Text;
  master_car_model: MasterSunroofProblem;
}
interface CREATE_SUNROOF_PROBLEMS_PAYLOAD {
  name: string;
  display_name: string;
  sort_order: number;
  active: boolean;
  icon: string;
}

interface UPDATE_SUNROOF_PROBLEMS_PAYLOAD {
  id: string;
  name: string;
  display_name: string;
  sort_order: number;
  active: boolean;
  icon: string;
}

export const masterSunroofProblemApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSunroofProblems: build.query<
      GET_MASTER_SUNROOF_PROBLEMS_RESPONSE,
      void
    >({
      query: () => ({
        url: `master-sunroof-problems`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    createSunroofProblem: build.mutation<
      CREATE_SUNROOF_PROBLEMS_RESPONSE,
      CREATE_SUNROOF_PROBLEMS_PAYLOAD
    >({
      query: (body) => ({
        url: `master-sunroof-problems`,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateSunroofProblem: build.mutation<
      CREATE_SUNROOF_PROBLEMS_RESPONSE,
      UPDATE_SUNROOF_PROBLEMS_PAYLOAD
    >({
      query: (body) => ({
        url: `master-sunroof-problems/${body.id}`,
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
