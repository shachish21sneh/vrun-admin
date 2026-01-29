import { commonApi } from "../common.api";
import { Ticket } from "@/constants/data";

type ErrorResponse = {
  error: string;
};

interface GET_TICKETS_RESPONSE {
  data: Ticket[];
  total: number;
}

interface UPDATE_TICKET_PAYLOAD {
  id: string;
  status?: string;
  technician_id?: string;
}

export const ticketsApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTickets: build.query<
      GET_TICKETS_RESPONSE,
      {
        limit: number;
        offset: number;
        query: string;
        status?: string;
      }
    >({
      query: (body) => ({
        url: `tickets?limit=${body.limit}&offset=${body.offset}&query=${body.query}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getTicketDetails: build.query<Ticket, { id: string }>({
      query: (body) => ({
        url: `tickets/${body.id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    updateTicketDetails: build.mutation<Ticket, UPDATE_TICKET_PAYLOAD>({
      query: (body) => ({
        url: `tickets/${body.id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getAllTicketsByMerchant: build.query<
      GET_TICKETS_RESPONSE,
      {
        limit: number;
        offset: number;
        query: string;
        merchant_id?: string;
        status?: string;
      }
    >({
      query: (body) => ({
        url: `tickets?limit=${body.limit}&offset=${body.offset}&query=${body.query}&merchant_id=${body.merchant_id}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
  }),
  overrideExisting: true,
});
