"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useGetRevenueQuery } from "@/toolkit/dashboard/dashboard.api";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AreaGraph({ period = "30d" }: { period?: string }) {
  const { data: revenueData, isLoading } = useGetRevenueQuery({ period });

  const chartData = React.useMemo(() => {
    if (!revenueData?.data?.revenueByPeriod) return [];
    return revenueData.data.revenueByPeriod.map((item) => ({
      date: item.date,
      revenue: item.value,
    }));
  }, [revenueData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[310px] w-full" />
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  const isIncreasing =
    revenueData?.data?.totalRevenue?.changeType === "increase";
  const changeValue = revenueData?.data?.totalRevenue?.change || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Revenue trend for the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) =>
                    formatCurrency(typeof value === "number" ? value : 0)
                  }
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill={chartConfig.revenue.color}
              fillOpacity={0.4}
              stroke={chartConfig.revenue.color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isIncreasing ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(changeValue).toFixed(2)}% this period
              {isIncreasing ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Daily average:{" "}
              {formatCurrency(revenueData?.data?.averageDaily || 0)}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
