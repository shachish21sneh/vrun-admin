import { useGetCarsQuery } from "@/toolkit/cars/cars.api";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useGetUsersCarsQuery } from "@/toolkit/dashboard/dashboard.api";

export function RecentUserCars() {
const { data, isLoading } = useGetUsersCarsQuery();
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
        {data?.data?.map((car: UserCar) => (
          <div
            key={car.id}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Image
                src={car.car_model.icon}
                alt={car.car_model.display_name}
                width={40}
                height={40}
                className="rounded object-contain"
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
                {car.plan_details?.plan_name ?? "No Plan"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}