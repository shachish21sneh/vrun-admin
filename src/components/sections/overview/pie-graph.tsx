'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { useGetTicketsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  tickets: {
    label: 'Tickets'
  },
  new: {
    label: 'New',
    color: 'hsl(var(--chart-1))'
  },
  accepted: {
    label: 'Accepted',
    color: 'hsl(var(--chart-2))'
  },
  inprogress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-3))'
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-4))'
  }
} satisfies ChartConfig;

export function PieGraph({ period = '1y' }: { period?: string }) {
  const { data: ticketsData, isLoading } = useGetTicketsQuery({ period });
  
  const chartData = React.useMemo(() => {
    if (!ticketsData?.data?.statusDistribution?.chart) return [];
    return ticketsData.data.statusDistribution.chart.map(item => ({
      status: item.status,
      tickets: item.count,
      label: item.label,
      fill: `var(--color-${item.status})`
    }));
  }, [ticketsData]);
  
  const totalTickets = React.useMemo(() => {
    return ticketsData?.data?.statusDistribution?.total || 0;
  }, [ticketsData]);

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24 mt-1" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[360px] flex items-center justify-center">
            <Skeleton className="h-64 w-64 rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-48" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Ticket Status Distribution</CardTitle>
        <CardDescription>Current status of all tickets</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="tickets"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTickets.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Tickets
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {ticketsData?.data?.topProblems?.problems?.[0] && (
            <>Top issue: {ticketsData.data.topProblems.problems[0].problemDisplayName} ({ticketsData.data.topProblems.problems[0].count} tickets)</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
