import React from "react";
import Image from "next/image";
import { UserCar } from "@/constants/data";

interface CarInfoProps {
  carData: UserCar;
}

const CarInfo: React.FC<CarInfoProps> = ({ carData }) => {
  return (
    <div className="flex p-6 rounded shadow max-w-xl justify-between items-center">
      {/* Left Section: Car Model Icon */}
      <div className="flex">
        {carData.car_model.icon && (
          <Image
            src={carData.car_model.icon}
            alt={`${carData.car_model.display_name} logo`}
            width={200}
            height={200}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {/* Right Section: Details */}
      <div className="flex flex-col justify-center">
        {/* Car Model Name */}
        <p className="text-lg text-gray-600 font-medium mb-4">
          {carData.car_model.display_name}
        </p>

        {/* Car Brand */}
        <div className="flex items-center mb-4">
          {carData.car_brand.icon && (
            <Image
              src={carData.car_brand.icon}
              alt={`${carData.car_brand.display_name} logo`}
              width={40}
              height={40}
              className="mr-2"
            />
          )}
          <h2 className="text-xl font-bold text-gray-800">
            {carData.car_brand.display_name}
          </h2>
        </div>

        {/* Additional Details */}
        <div className="text-gray-700">
          <p className="mb-2">
            <span className="font-medium">Registration Year:</span>{" "}
            {carData.registration_year}
          </p>
          <p className="mb-2">
            <span className="font-medium">Sunroof Type:</span>{" "}
            {carData.sunroof_type}
          </p>
          {/* <p>
            <span className="font-medium">Active:</span>{" "}
            {carData.active ? "Yes" : "No"}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default CarInfo;
