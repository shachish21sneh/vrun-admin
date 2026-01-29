'use client';

import { CreditCard, AlertCircle } from 'lucide-react';
import { useGetSubscriptionsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SubscriptionStats({ period = '30d' }: { period?: string }) {
  const { data: subscriptionData, isLoading } = useGetSubscriptionsQuery({ period });
  
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeSubscriptions = subscriptionData?.data?.activeSubscriptions;
  const expiringSubscriptions = subscriptionData?.data?.expiringSubscriptions;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeSubscriptions?.current || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(activeSubscriptions?.change || 0)} from last period
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Expiring Soon
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {expiringSubscriptions?.count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Subscriptions expiring within 30 days
          </p>
        </CardContent>
      </Card>
      
      {expiringSubscriptions && expiringSubscriptions.count > 0 && (
        <Alert className="md:col-span-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {expiringSubscriptions.count} subscription{expiringSubscriptions.count > 1 ? 's' : ''} will expire soon. 
            Consider reaching out to these customers for renewal.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}