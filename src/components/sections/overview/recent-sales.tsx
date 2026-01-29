import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useGetRecentSalesQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentSales() {
  const { data: salesData, isLoading } = useGetRecentSalesQuery({ limit: 5 });
  
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };
  
  const formatCurrency = (amount: string) => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="ml-auto h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {salesData?.data?.sales?.slice(0, 5).map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {getInitials(sale.customerName, sale.customerEmail)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.customerName || 'Customer'}
            </p>
            <p className="text-sm text-muted-foreground">
              {sale.customerEmail}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +{formatCurrency(sale.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
