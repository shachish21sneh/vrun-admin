import React from "react";
import { Technician } from "@/constants/data";

type PersonalInfoProps = {
  userData: Technician;
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
            <span className="font-semibold">Name:</span>{" "}
            {userData?.name || "N/A"}
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold">Phone Number:</span>{" "}
            {`${userData?.phone}` || "N/A"}
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
                <span className="font-semibold">Availablity status:</span>{" "}
                {userData?.availability_status}
              </p>
            </div>
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {userData?.active ? "Active" : "InActive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
