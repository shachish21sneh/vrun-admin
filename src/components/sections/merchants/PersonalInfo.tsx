import React from "react";
import Image from "next/image";
import { Merchant } from "@/constants/data";

type PersonalInfoProps = {
  userData: Merchant;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userData }) => {
  return (
    <div className="mx-auto p-6">
      {/* Personal Information Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Merchant Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 mb-6">
        <div>
          <p>
            <span className="font-semibold">Business Name:</span>{" "}
            {userData?.business_name || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Business Email:</span>{" "}
            {userData?.business_email || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Business Phone:</span>{" "}
            {userData?.business_phone
              ? formatPhone(userData.business_phone)
              : "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {userData?.full_address || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">City:</span>{" "}
            {userData?.city || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">State:</span>{" "}
            {userData?.state || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Coordinates:</span>{" "}
            {`(${userData?.latitude || "N/A"}, ${
              userData?.longitude || "N/A"
            })`}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {userData?.active ? "Active" : "Inactive"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">User ID:</span>{" "}
            {userData?.user_id || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {userData?.created_at || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Updated At:</span>{" "}
            {userData?.updated_at || "N/A"}
          </p>
        </div>
      </div>

      {/* Brands Section */}
      {/* <h3 className="text-xl font-bold text-gray-800 mb-4">Brands</h3>
      {userData?.brands?.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {userData.brands.map((brand, index) => (
            <li key={index}>{brand}</li>
          ))}
        </ul>
      ) : (
        <p>No brands available.</p>
      )} */}

      {/* Working Days Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Working Days</h3>
      {userData?.working_days?.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {userData.working_days.map((day, index) => (
            <li key={index}>{day}</li>
          ))}
        </ul>
      ) : (
        <p>No working days specified.</p>
      )}

      {/* Holidays Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Holidays</h3>
      {userData?.holidays?.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {userData.holidays.map((holiday, index) => (
            <li key={index}>{holiday}</li>
          ))}
        </ul>
      ) : (
        <p>No holidays specified.</p>
      )}

      {/* Image Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Business Image</h3>
      {userData?.image_url ? (
        <div className="relative w-full max-w-sm h-64">
          <Image
            src={userData.image_url}
            alt="Business"
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-md"
          />
        </div>
      ) : (
        <p>No image available.</p>
      )}
    </div>
  );
};

// Utility function to format phone numbers
const formatPhone = (phone: string): string => {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
};

export default PersonalInfo;
