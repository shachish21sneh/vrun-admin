// File: components/UserLocation.tsx
import React from "react";
import { UserAddresses } from "@/constants/data";
import UserAddressCard from "./UserAddressCard";

interface UserLocationProps {
  userAddressesData: UserAddresses[];
}

const UserLocation: React.FC<UserLocationProps> = ({ userAddressesData }) => {
  return (
    <div className="flex flex-wrap">
      {userAddressesData.map((address) => (
        <UserAddressCard key={address.id} address={address} />
      ))}
    </div>
  );
};

export default UserLocation;
