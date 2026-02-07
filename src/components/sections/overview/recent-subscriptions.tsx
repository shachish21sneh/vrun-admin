'use client';

import { Mail, Phone, Clock } from 'lucide-react';
import { useGetRecentCarsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function RecentCars({ limit = 10 }: { limit?: number }) {
  const { data, isLoading } = useGetRecentCarsQuery({ limit });

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  // ✅ only active cars
  const activeCars =
    (data?.data?.cars ?? []).filter((car) => car.active === true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cars</CardTitle>
        <CardDescription>
          Latest active cars added ({activeCars.length})
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-auto max-h-[400px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] sticky left-0 bg-background">
                  Customer
                </TableHead>
                <TableHead>Registration Year</TableHead>
                <TableHead>Sunroof Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Order ID</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {activeCars.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No active cars found
                  </TableCell>
                </TableRow>
              ) : (
                activeCars.map((car) => (
                  <TableRow key={car.id}>
                    {/* Customer */}
                    <TableCell className="sticky left-0 bg-background">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(car.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {car.userName}
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">
                                {car.userEmail}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{car.userPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{car.registrationYear}</TableCell>

                    <TableCell>
                      {car.sunroofType === '1'
                        ? 'Single Panel'
                        : 'Panoramic'}
                    </TableCell>

                    <TableCell>
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">
                          {formatDateTime(car.createdAt)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="text-xs font-mono">
                        {car.orderId}
                      </code>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}