import { useGetCarsQuery } from "@/toolkit/dashboard/dashboard.api";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export function RecentUserCars() {
  const { data, isLoading } = useGetCarsQuery();

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

      <div className="divide-y">
        {data?.data?.map((car) => (
          <div key={car.id} className="p-4 space-y-2">
            {/* TOP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={car.car_model.icon}
                  alt={car.car_model.display_name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <p className="font-medium">
                    {car.car_model.display_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {car.car_brand.display_name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono text-sm">
                  {car.registration_number}
                </p>
                <p className="text-xs text-muted-foreground">
                  {car.registration_year}
                </p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                👤 <b>User ID:</b> {car.user_id}
              </span>

              <span>
                💳 <b>Plan:</b> {car.plan_name ?? "No Plan"}
              </span>

              <span>
                💰 <b>Amount:</b>{" "}
                {car.amount ? `₹${car.amount}` : "—"}
              </span>
            </div>

            {/* PAYMENT */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>
                📦 Order: {car.order_id ?? "—"}
              </span>

              <span>
                🧾 Payment: {car.razorpay_payment_id ?? "—"}
              </span>

              <span>
                🗓️{" "}
                {car.plan_start
                  ? `${new Date(
                      car.plan_start,
                    ).toLocaleDateString()} → ${new Date(
                      car.plan_end!,
                    ).toLocaleDateString()}`
                  : "No plan period"}
              </span>

              {car.plan_status === "active" && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                  Active
                </span>
              )}
            </div>

            {/* FOOTER */}
            <div className="text-xs text-muted-foreground">
              Created:{" "}
              {new Date(car.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}