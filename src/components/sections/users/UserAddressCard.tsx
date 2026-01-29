import React from "react";
import { UserAddresses } from "@/constants/data";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserAddressCardProps {
  address: UserAddresses;
}

const UserAddressCard: React.FC<UserAddressCardProps> = ({ address }) => {
  return (
    <Card className="max-w-sm m-4">
      <CardHeader>
        <CardTitle>{address.name}</CardTitle>
        <CardDescription>{address.tag}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base">Phone: {address.phone}</p>
        <p className="text-gray-700 text-base">Address: {address.full_address}</p>
        <p className="text-gray-700 text-base">City: {address.city}</p>
        <p className="text-gray-700 text-base">State: {address.state}</p>
        <p className="text-gray-700 text-base">
          Coordinates: {address.latitude}, {address.longitude}
        </p>
        <p className="text-gray-700 text-base">
          Active: {address.active ? "Yes" : "No"}
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-gray-500 text-sm">
          Created at: {format(new Date(address.created_at), "PP")}
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserAddressCard;
