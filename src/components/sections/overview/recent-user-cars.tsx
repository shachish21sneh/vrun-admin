'use client';

import { useGetUsersCarsQuery } from "@/toolkit/dashboard/dashboard.api";
import type { UserCar } from "@/toolkit/dashboard/dashboard.api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentUserCars() {
  const { data, isLoading } = useGetUsersCarsQuery();

  const cars: UserCar[] = (data?.data ?? []).slice(0, 10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Added Cars</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-auto max-h-[400px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background min-w-[160px]">
                  Registration
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cars.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No cars available
                  </TableCell>
                </TableRow>
              ) : (
                cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="sticky left-0 bg-background font-mono">
                      {car.registration_number}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          car.plan_status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {car.plan_status ?? "No Plan"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {car.plan_name ?? "—"}
                    </TableCell>

                    <TableCell>
                      {car.amount ? `₹${car.amount}` : "—"}
                    </TableCell>

                    <TableCell className="text-xs">
                      {car.plan_start
                        ? `${new Date(
                            car.plan_start
                          ).toLocaleDateString()} → ${new Date(
                            car.plan_end!
                          ).toLocaleDateString()}`
                        : "—"}
                    </TableCell>

                    <TableCell className="text-xs font-mono">
                      {car.order_id ?? "—"}
                    </TableCell>

                    <TableCell className="text-xs font-mono">
                      {car.razorpay_payment_id ?? "—"}
                    </TableCell>

                    <TableCell className="text-xs">
                      {new Date(car.created_at).toLocaleString()}
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