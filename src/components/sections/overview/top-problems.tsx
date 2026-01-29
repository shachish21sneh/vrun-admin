'use client';

import { AlertCircle } from 'lucide-react';
import { useGetTicketsQuery } from '@/toolkit/dashboard/dashboard.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';

export function TopProblems({ period = '1y' }: { period?: string }) {
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
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const problems = ticketsData?.data?.topProblems?.problems || [];
  const totalReported = ticketsData?.data?.topProblems?.totalReported || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Issues</CardTitle>
        <CardDescription>
          Most reported sunroof problems ({totalReported} total reports)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {problems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No problem data available
            </div>
          ) : (
            problems.map((problem) => {
              const percentage = totalReported > 0 
                ? Math.round((problem.count / totalReported) * 100) 
                : 0;
              
              return (
                <div key={problem.problemId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {problem.problemIcon ? (
                          <Image
                            src={problem.problemIcon}
                            alt={problem.problemDisplayName}
                            width={32}
                            height={32}
                            className="object-contain"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <AlertCircle className={`h-5 w-5 text-muted-foreground ${problem.problemIcon ? 'hidden' : ''}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {problem.problemDisplayName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {problem.count} {problem.count === 1 ? 'report' : 'reports'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {percentage}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}