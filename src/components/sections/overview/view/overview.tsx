import { AreaGraph } from "../area-graph";
import { BarGraph } from "../bar-graph";
import { PieGraph } from "../pie-graph";
import { TopMerchants } from "../top-merchants";
import { TopCars } from "../top-cars";
import { TopProblems } from "../top-problems";
import { SubscriptionStats } from "../subscription-stats";
import { RecentSubscriptions } from "../recent-subscriptions";
import PageContainer from "@/components/layout/page-container";
import { RecentSales } from "../recent-sales";
import { Button } from "@/components/ui/button";
import { RecentUserCars } from "../recent-user-cars";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetOverviewQuery,
  useGetRecentSalesQuery,
} from "@/toolkit/dashboard/dashboard.api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePeriod, timePeriodLabels } from "@/types/dashboard";

export default function OverViewPage() {
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.LAST_30_DAYS);
  const { data: overviewData, isLoading } = useGetOverviewQuery({ period });
  const { data: salesData } = useGetRecentSalesQuery({ limit: 10 });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value?.toFixed(2)}%`;
  };
  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as TimePeriod)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TimePeriod).map((value) => (
                  <SelectItem key={value} value={value}>
                    {timePeriodLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
					  xmlns="http://www.w3.org/2000/svg"
					  viewBox="0 0 24 24"
					  fill="none"
					  stroke="currentColor"
					  strokeLinecap="round"
					  strokeLinejoin="round"
					  strokeWidth="2"
					  className="h-4 w-4 text-muted-foreground"
					>
                    <path d="M18 7H15.79a5.49 5.49 0 0 0-1-2H18a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2h3.5a3.5 3.5 0 0 1 3.15 2H7a1 1 0 0 0 0 2h7a3.5 3.5 0 0 1-3.45 3H7a.7 .7 0 0 0-.14 0 .65 .65 0 0 0-.2 0 .69 .69 0 0 0-.19 .1l-.12 .07 0 0a.75 .75 0 0 0-.14 .17 1.1 1.1 0 0 0-.09 .14 .61 .61 0 0 0 0 .18A.65 .65 0 0 0 6 13s0 0 0 0a.7 .7 0 0 0 0 .14 .65 .65 0 0 0 0 .2 .69 .69 0 0 0 .1 .19s0 .08 .07 .12l6 7a1 1 0 0 0 1.52-1.3L9.18 14H10.5A5.5 5.5 0 0 0 16 9h2a1 1 0 0 0 0-2Z"/>
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          overviewData?.data?.totalRevenue?.current || 0
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(
                          overviewData?.data?.totalRevenue?.change || 0
                        )}{" "}
                        from last month
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        +{overviewData?.data?.subscriptions?.current || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(
                          overviewData?.data?.subscriptions?.change || 0
                        )}{" "}
                        from last month
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        +{overviewData?.data?.sales?.current || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(
                          overviewData?.data?.sales?.change || 0
                        )}{" "}
                        from last month
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Tickets
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {overviewData?.data?.completedTickets?.current || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(
                          overviewData?.data?.completedTickets?.change || 0
                        )}{" "}
                        from last month
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph period={period} />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made {salesData?.data?.totalSales || 0} sales this
                    month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph period={period} />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph period="1y" />
              </div>
            </div>
            {/* Subscription Section */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Subscription Management</h3>
              <div className="grid gap-4">
                <SubscriptionStats period={period} />
                <RecentSubscriptions period={period} />
              </div>
            </div>
			
			{/* Users Car Section */}
			<div className="mt-6 space-y-4">
				<h3 className="text-lg font-semibold">Users Car List</h3>
				<div className="grid gap-4">
					<RecentUserCars />
				</div>
			</div>

            {/* Ticket Insights Section */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Ticket Insights</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <TopMerchants period="1y" />
                <TopCars period="1y" />
                <TopProblems period="1y" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
