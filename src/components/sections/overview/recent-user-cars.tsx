import { useGetUsersCarsQuery } from "@/toolkit/dashboard/dashboard.api";
import type { UserCar } from "@/toolkit/dashboard/dashboard.api";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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

      <div className="divide-y">
        {cars.map((car) => (
          <div key={car.id} className="p-4 space-y-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}