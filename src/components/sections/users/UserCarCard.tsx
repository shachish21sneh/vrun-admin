// File: components/UserCarCard.tsx
import React from "react";
import Image from "next/image";
import { UserCar } from "@/constants/data";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { format } from "date-fns";

interface UserCarCardProps {
  car: UserCar;
}

const UserCarCard: React.FC<UserCarCardProps> = ({ car }) => {
  return (
    <Card className="max-w-sm m-4">
      <CardHeader className="flex items-center">
        {car.car_brand.icon && (
          <Image
            src={car.car_brand.icon}
            alt={`${car.car_brand.display_name} logo`}
            width={32}
            height={32}
            className="mr-2"
          />
        )}
        <CardTitle>{car.car_brand.display_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          {car.car_model.icon && (
            <Image
              src={car.car_model.icon}
              alt={`${car.car_model.display_name} logo`}
              width={24}
              height={24}
              className="mr-2"
            />
          )}
          <CardDescription>{car.car_model.display_name}</CardDescription>
        </div>
        <p className="text-gray-700 text-base">
          Registration Year: {car.registration_year}
        </p>
        <p className="text-gray-700 text-base">
          Sunroof Type: {car.sunroof_type}
        </p>
        <p className="text-gray-700 text-base">
          Active: {car.active ? "Yes" : "No"}
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-gray-500 text-sm">
          Created at:{" "}
          {car.created_at
            ? format(new Date(car.created_at), "dd/MM/yyyy")
            : "N/A"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserCarCard;
