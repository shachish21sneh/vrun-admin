'use client';

import { Building2, Mail, Ticket } from 'lucide-react';
import { useGetTicketsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export function TopMerchants({ period = '1y' }: { period?: string }) {
  const { data: ticketsData, isLoading } = useGetTicketsQuery({ period });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const merchants = ticketsData?.data?.topMerchants?.merchants || [];
  const totalTickets = ticketsData?.data?.topMerchants?.totalTickets || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Merchants</CardTitle>
        <CardDescription>
          Merchants with the most tickets ({totalTickets} total tickets)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {merchants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No merchant data available
            </div>
          ) : (
            merchants.map((merchant, index) => (
              <div
                key={merchant.merchantId}
                className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {merchant.merchantName}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1" />
                    {merchant.merchantEmail}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">{merchant.ticketCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}