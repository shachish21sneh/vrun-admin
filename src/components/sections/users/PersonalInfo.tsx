import React from "react";
import { Customer } from "@/constants/data";

type PersonalInfoProps = {
  userData: Customer;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userData }) => {
  return (
    <div className="mx-auto p-6">
      {/* Personal Information Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 mb-6">
        <div>
          <p>
            <span className="font-semibold">First Name:</span>{" "}
            {userData?.first_name || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Last Name:</span>{" "}
            {userData?.last_name || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Phone Number:</span>{" "}
            {`${userData?.phone_ext} ${userData?.phone}` || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {userData?.email || "N/A"}
          </p>
        </div>

        <div>
          <p>
            <div>
              <p>
                <span className="font-semibold">Email Verified:</span>{" "}
                {userData?.is_email_verified ? "Yes" : "No"}
              </p>
            </div>
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Mobile Verified:</span>{" "}
            {userData?.is_mobile_verified ? "Yes" : "No"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {userData?.status || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
