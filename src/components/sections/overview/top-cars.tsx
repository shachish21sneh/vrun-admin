'use client';

import { Car, Calendar, Ticket } from 'lucide-react';
import { useGetTicketsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export function TopCars({ period = '1y' }: { period?: string }) {
  const { data: ticketsData, isLoading } = useGetTicketsQuery({ period });
  
  const getSunroofTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      '1': 'Standard',
      '2': 'Panoramic',
      '3': 'Convertible'
    };
    return types[type] || type;
  };
  
  const formatCarName = (name: string) => {
    // Convert "KIA kia_soul" to "KIA Soul"
    const parts = name.split(' ');
    if (parts.length > 1) {
      const brand = parts[0];
      const model = parts[1].split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return `${brand} ${model}`;
    }
    return name;
  };
  
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

  const cars = ticketsData?.data?.topCars?.cars || [];
  const totalTickets = ticketsData?.data?.topCars?.totalTickets || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cars</CardTitle>
        <CardDescription>
          Cars with the most reported issues ({totalTickets} total tickets)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cars.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No car data available
            </div>
          ) : (
            cars.map((car, index) => (
              <div
                key={car.carId}
                className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {formatCarName(car.carName)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(car.registrationYear).getFullYear()}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getSunroofTypeLabel(car.sunroofType)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">{car.ticketCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}