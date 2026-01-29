import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SubscriptionBadgeProps {
  status: 'active' | 'created' | 'completed' | 'cancelled';
  className?: string;
}

export function SubscriptionBadge({ status, className }: SubscriptionBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600'
    },
    created: {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
    },
    completed: {
      label: 'Completed',
      variant: 'outline' as const,
      className: ''
    },
    cancelled: {
      label: 'Cancelled',
      variant: 'destructive' as const,
      className: ''
    }
  };

  const config = statusConfig[status] || statusConfig.created;

  return (
    <Badge 
      variant={config.variant} 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}