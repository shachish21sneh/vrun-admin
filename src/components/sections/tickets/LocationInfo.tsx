import React from "react";
import { UserAddresses } from "@/constants/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LocationInfoProps {
  address: UserAddresses;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ address }) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${address.latitude},${address.longitude}`;

  return (
    <Card className="max-w-sm m-4">
      <CardHeader>
        <CardTitle>{address.name}</CardTitle>
        <CardDescription>{address.tag}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base">Phone: {address.phone}</p>
        <p className="text-gray-700 text-base">
          Address: {address.full_address}
        </p>
        <p className="text-gray-700 text-base">City: {address.city}</p>
        <p className="text-gray-700 text-base">State: {address.state}</p>
        <p className="text-gray-700 text-base">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View on Map
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default LocationInfo;
