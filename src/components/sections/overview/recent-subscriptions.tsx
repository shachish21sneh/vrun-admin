'use client';

import { Mail, Phone, Calendar, CreditCard, Clock } from 'lucide-react';
import { useGetSubscriptionsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SubscriptionBadge } from './subscription-badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentSubscriptions({ period = '30d' }: { period?: string }) {
  const { data: subscriptionData, isLoading } = useGetSubscriptionsQuery({ period });
  
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const recentSubscriptions = subscriptionData?.data?.recentSubscriptions?.subscriptions || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Subscriptions</CardTitle>
        <CardDescription>
          Latest subscription activities ({subscriptionData?.data?.recentSubscriptions?.count || 0} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto max-h-[400px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] sticky left-0 bg-background">Customer</TableHead>
                <TableHead className="min-w-[90px]">Status</TableHead>
                <TableHead className="min-w-[140px]">Created At</TableHead>
                <TableHead className="min-w-[100px]">Period Start</TableHead>
                <TableHead className="min-w-[100px]">Period End</TableHead>
                <TableHead className="min-w-[80px]">Days Left</TableHead>
                <TableHead className="min-w-[160px]">Subscription ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No subscription data available
                  </TableCell>
                </TableRow>
              ) : (
                recentSubscriptions.map((subscription) => {
                  const daysRemaining = getDaysRemaining(subscription.currentPeriodEnd);
                  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 0;
                  
                  return (
                    <TableRow key={subscription.id}>
                      <TableCell className="sticky left-0 bg-background">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {getInitials(subscription.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-none truncate">
                              {subscription.userName}
                            </p>
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{subscription.userEmail}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span>{subscription.userPhone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <SubscriptionBadge status={subscription.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs">{formatDateTime(subscription.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs">{formatDate(subscription.currentPeriodStart)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs">{formatDate(subscription.currentPeriodEnd)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {subscription.status === 'active' && daysRemaining !== null ? (
                          <span className={`text-sm font-medium ${
                            isExpiringSoon ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {daysRemaining}d
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <code className="text-xs font-mono truncate">{subscription.razorpaySubscriptionId}</code>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}