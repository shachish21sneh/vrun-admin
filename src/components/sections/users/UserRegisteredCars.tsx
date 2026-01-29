// File: components/UserRegisteredCars.tsx
import React from "react";
import { UserCar } from "@/constants/data";
import UserCarCard from "./UserCarCard";

interface UserRegisteredCarsProps {
  userCarsData: UserCar[];
}

const UserRegisteredCars: React.FC<UserRegisteredCarsProps> = ({
  userCarsData,
}) => {
  return (
    <div className="flex flex-wrap">
      {userCarsData.map((car) => (
        <UserCarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default UserRegisteredCars;
