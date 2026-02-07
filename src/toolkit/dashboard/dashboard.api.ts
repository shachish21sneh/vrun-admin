import { commonApi } from "../common.api";

type ErrorResponse = {
  error: string;
};

interface MetricData {
  current: number;
  previous: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
}

interface OverviewResponse {
  success: boolean;
  data: {
    totalRevenue: MetricData;
    subscriptions: MetricData;
    sales: MetricData;
    completedTickets: MetricData;
    lastUpdated: string;
  };
  meta: {
    period: string;
    lastUpdated: string;
  };
}

interface Sale {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  date: string;
  status: string;
}

interface RecentSalesResponse {
  success: boolean;
  data: {
    sales: Sale[];
    totalSales: number;
  };
  meta: {
    lastUpdated: string;
  };
}

interface RevenueDataPoint {
  date: string;
  value: number;
}

interface RevenueTrendResponse {
  success: boolean;
  data: {
    revenueByMonth: RevenueDataPoint[];
    totalRevenue: number;
  };
  meta: {
    period: string;
    lastUpdated: string;
  };
}

interface RevenueResponse {
  success: boolean;
  data: {
    totalRevenue: MetricData;
    revenueByPeriod: RevenueDataPoint[];
    averageDaily: number;
  };
  meta: {
    period: string;
    lastUpdated: string;
  };
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  planId: string;
  status: 'active' | 'created' | 'completed' | 'cancelled';
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  razorpaySubscriptionId: string;
}

interface SubscriptionsResponse {
  success: boolean;
  data: {
    activeSubscriptions: MetricData;
    expiringSubscriptions: {
      count: number;
      subscriptions: Subscription[];
    };
    recentSubscriptions: {
      count: number;
      subscriptions: Subscription[];
    };
  };
  meta: {
    period: string;
    lastUpdated: string;
  };
}

interface StatusDistribution {
  status: string;
  count: number;
  label: string;
}

interface TopMerchant {
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
  ticketCount: number;
}

interface TopCar {
  carId: string;
  carName: string;
  registrationYear: string;
  sunroofType: string;
  ticketCount: number;
}

interface TopProblem {
  problemId: string;
  problemName: string;
  problemDisplayName: string;
  problemIcon: string;
  count: number;
}

interface TicketsResponse {
  success: boolean;
  data: {
    statusDistribution: {
      chart: StatusDistribution[];
      total: number;
    };
    topMerchants: {
      merchants: TopMerchant[];
      totalTickets: number;
    };
    topCars: {
      cars: TopCar[];
      totalTickets: number;
    };
    topProblems: {
      problems: TopProblem[];
      totalReported: number;
    };
  };
  meta: {
    period: string;
    lastUpdated: string;
  };
}

export interface CarBrand {
  name: string;
  display_name: string;
  icon: string;
}

export interface CarModel {
  name: string;
  display_name: string;
  icon: string;
}

export interface UserCar {
  id: string;
  user_id: string;

  registration_number: string;
  registration_year: string;
  sunroof_type: string;

  plan_id: string | null;
  plan_name: string | null;
  order_id: string | null;
  razorpay_payment_id: string | null;
  amount: string | null;
  plan_start: string | null;
  plan_end: string | null;
  plan_status: "active" | "inactive" | "expired" | null;

  active: boolean;
  created_at: string;
  updated_at: string;

  car_brand: CarBrand;
  car_model: CarModel;
}


export const dashboardApi = commonApi.injectEndpoints({
  endpoints: (build) => ({
    getOverview: build.query<OverviewResponse, { period?: string }>({
      query: ({ period = "30d" }) => ({
        url: `dashboard/overview?period=${period}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getRecentSales: build.query<RecentSalesResponse, { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: `dashboard/recent-sales?limit=${limit}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getRevenueTrend: build.query<RevenueTrendResponse, { period?: string }>({
      query: ({ period = "30d" }) => ({
        url: `dashboard/charts/revenue-trend?period=${period}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getRevenue: build.query<RevenueResponse, { period?: string }>({
      query: ({ period = "30d" }) => ({
        url: `dashboard/revenue?period=${period}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getSubscriptions: build.query<SubscriptionsResponse, { period?: string }>({
      query: ({ period = "30d" }) => ({
        url: `dashboard/subscriptions?period=${period}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
    getTickets: build.query<TicketsResponse, { period?: string }>({
      query: ({ period = "30d" }) => ({
        url: `dashboard/tickets?period=${period}`,
      }),
      transformErrorResponse: (response) => {
        return (response?.data as unknown as ErrorResponse)?.error;
      },
    }),
	getUsersCars: build.query<UsersCarsResponse, void>({
  query: () => ({
    url: "cars/public",
  }),
}),
  }),
  overrideExisting: true,
});

export const {
  useGetOverviewQuery,
  useGetRecentSalesQuery,
  useGetRevenueTrendQuery,
  useGetRevenueQuery,
  useGetSubscriptionsQuery,
  useGetTicketsQuery,
  useGetUsersCarsQuery,
} = dashboardApi;