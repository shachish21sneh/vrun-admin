'use client';

import { Mail, Phone, Calendar, CreditCard, Clock } from 'lucide-react';
import { useGetSubscriptionsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SubscriptionBadge } from './subscription-badge';

export function RecentSubscriptions({ period = '30d' }: { period?: string }) {
  const { data: subscriptionData, isLoading } =
    useGetSubscriptionsQuery({ period });

  const subscriptions =
    subscriptionData?.data?.recentSubscriptions?.subscriptions?.slice(0, 10) || [];

  const getInitials = (name: string) => {
    const parts = name?.trim().split(' ');
    if (parts?.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name?.slice(0, 2)?.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="p-4 font-medium">
        Recent Subscriptions
      </div>

      <div className="divide-y rounded-lg border">
        {subscriptions.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No subscription data available
          </div>
        ) : (
          subscriptions.map((subscription) => {
            const daysRemaining = getDaysRemaining(
              subscription.currentPeriodEnd
            );
            const isExpiringSoon =
              daysRemaining !== null &&
              daysRemaining <= 30 &&
              daysRemaining > 0;

            return (
              <div key={subscription.id} className="p-4 space-y-3">
                {/* ROW 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(subscription.userName)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium">
                        {subscription.userName}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {subscription.userEmail}
                      </div>
                    </div>
                  </div>

                  <SubscriptionBadge status={subscription.status} />
                </div>

                {/* ROW 2 */}
                <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {subscription.userPhone}
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(subscription.createdAt)}
                  </div>
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    Start: {formatDate(subscription.currentPeriodStart)}
                  </div>
                  <div>
                    End: {formatDate(subscription.currentPeriodEnd)}
                  </div>
                  <div>
                    Days Left:{' '}
                    {subscription.status === 'active' &&
                    daysRemaining !== null ? (
                      <span
                        className={`font-medium ${
                          isExpiringSoon
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}
                      >
                        {daysRemaining}d
                      </span>
                    ) : (
                      '—'
                    )}
                  </div>
                  <div className="truncate">
                    Sub ID:{' '}
                    {subscription.razorpaySubscriptionId || '—'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}