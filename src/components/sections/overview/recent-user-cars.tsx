import { useGetUsersCarsQuery } from "@/toolkit/dashboard/dashboard.api";
import type { UserCar } from "@/toolkit/dashboard/dashboard.api";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentUserCars() {
  const { data, isLoading } = useGetUsersCarsQuery();

  const cars: UserCar[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="p-4 font-medium">Recently Added Cars</div>

      <div className="divide-y rounded-lg border">
  {cars.map((car) => (
    <div key={car.id} className="p-4 space-y-2">
      {/* ROW 1 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Registration No:{" "}
          <span className="font-mono">
            {car.registration_number}
          </span>
        </p>

        <span
          className={`rounded px-2 py-0.5 text-xs ${
            car.plan_status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {car.plan_status ?? "No Plan"}
        </span>
      </div>

      {/* ROW 2 */}
      <div className="text-sm text-muted-foreground">
        Registration Year: {car.registration_year}
      </div>

      {/* ROW 3 */}
      <div className="text-sm">
        Plan:{" "}
        <span className="font-medium">
          {car.plan_name ?? "—"}
        </span>
      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>Order ID: {car.order_id ?? "—"}</div>
        <div>Payment ID: {car.razorpay_payment_id ?? "—"}</div>
        <div>
          Amount: {car.amount ? `₹${car.amount}` : "—"}
        </div>
        <div>
          Period:{" "}
          {car.plan_start
            ? `${new Date(
                car.plan_start,
              ).toLocaleDateString()} → ${new Date(
                car.plan_end!,
              ).toLocaleDateString()}`
            : "—"}
        </div>
      </div>

      {/* ROW 5 */}
      <div className="text-xs text-muted-foreground">
        Created At:{" "}
        {new Date(car.created_at).toLocaleString()}
      </div>

      {!car.active && (
        <div className="text-xs text-red-600">
          Inactive Car
        </div>
      )}
    </div>
  ))}
</div>
    </div>
  );
}