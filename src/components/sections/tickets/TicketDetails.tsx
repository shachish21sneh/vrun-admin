import React, { useState } from "react";
import { Ticket } from "@/constants/data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { format } from "date-fns";
import { ticketsApi } from "@/toolkit/tickets/tickets.api";
import { toast } from "react-toastify";
import { Edit, CircleX } from "lucide-react";

import { techniciansApi } from "@/toolkit/technicians/technicians.api";

interface TicketInfoProps {
  ticketData: Ticket;
  refetch: () => void;
}

const TicketDetails: React.FC<TicketInfoProps> = ({ ticketData, refetch }) => {
  const { useUpdateTicketDetailsMutation } = ticketsApi;
  const { useGetTechniciansByMerchantQuery } = techniciansApi;
  const [handleUpdateTicketDetails, { isLoading }] =
    useUpdateTicketDetailsMutation();
  const { data } = useGetTechniciansByMerchantQuery({
    merchant_id: ticketData?.merchant_id as string,
  });
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingTechnician, setIsEditingTechnician] = useState(false);

  const handleStatusChange = async (value: string) => {
    try {
      await handleUpdateTicketDetails({
        id: ticketData.id,
        status: value,
      }).unwrap();
      refetch();
      toast.success("Ticket status updated successfully");
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      toast.error("Failed to update ticket status. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Ticket Details</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* General Information */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">
            General Information
          </h2>
          <p>
            <strong>ID:</strong> {ticketData.id}
          </p>
          <p>
            <strong>Description:</strong> {ticketData.description}
          </p>
          <p className="flex items-center gap-2">
            <strong>Status:</strong>{" "}
            {isEditingStatus ? (
              <>
                <Select
                  defaultValue={ticketData.status}
                  onValueChange={handleStatusChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketData.status === "new" && (
                      <>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="accepted">Accept Booking</SelectItem>
                        <SelectItem value="rejected">Reject Booking</SelectItem>
                      </>
                    )}
                    {ticketData.status === "accepted" ||
                      (ticketData.status === "inprogress" && (
                        <>
                          <SelectItem value="cancelled">
                            Cancel Booking
                          </SelectItem>
                          <SelectItem value="inprogress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </>
                      ))}
                  </SelectContent>
                </Select>
                <CircleX
                  className="h-5 w-5 text-gray-600 cursor-pointer"
                  onClick={() => setIsEditingStatus(false)}
                />
              </>
            ) : (
              <>
                <Badge
                  className={
                    ticketData.status === "new"
                      ? "bg-green-500"
                      : ticketData.status === "accepted"
                      ? "bg-blue-500"
                      : ticketData.status === "inprogress"
                      ? "bg-yellow-400"
                      : "bg-gray-500"
                  }
                >
                  <span className="capitalize text-base">
                    {ticketData.status === "inprogress"
                      ? "In Progress"
                      : ticketData.status}
                  </span>
                </Badge>
                <Edit
                  className="h-5 w-5 text-gray-600 cursor-pointer"
                  onClick={() => setIsEditingStatus(true)}
                />
              </>
            )}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {format(new Date(ticketData.created_at), "dd/MM/yyyy")}
          </p>
        </div>

        {/* Appointment Details */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">
            Appointment Details
          </h2>
          <p>
            <strong>Date:</strong>{" "}
            {format(new Date(ticketData.appointment_date), "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Time:</strong> {ticketData.appointment_time}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {ticketData.location?.full_address || "N/A"}
          </p>
        </div>

        {/* Customer Information */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-700">
            Customer Information
          </h2>
          <p>
            <strong>Name:</strong>{" "}
            <Link
              href={`/users/view/${ticketData?.user_id}`}
              target="_blank"
              className="text-blue-500"
            >
              {`${ticketData.user?.first_name || "N/A"} ${
                ticketData.user?.last_name || ""
              }`}
            </Link>
          </p>
          <p>
            <strong>Email:</strong> {ticketData?.email}
          </p>
          <p>
            <strong>Phone:</strong> {ticketData?.phone}
          </p>
        </div>

        {/* Merchant Information */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-700">
            Merchant Information
          </h2>
          <p>
            <strong>Name:</strong>{" "}
            <Link
              href={`/merchant/view/${ticketData.merchant?.id}`}
              target="_blank"
              className="text-blue-500"
            >
              {`${ticketData.merchant?.first_name || "N/A"} ${
                ticketData.merchant?.last_name || ""
              }`}
            </Link>
          </p>
          <p>
            <strong>Email:</strong> {ticketData.merchant?.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {ticketData.merchant?.phone || "N/A"}
          </p>
        </div>

        {/* Additional Details */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-700">
            Additional Details
          </h2>
          <p>
            <strong>Sunroof Problem:</strong>{" "}
            {ticketData.sunroof_problem?.name || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <strong>Technician:</strong>{" "}
            {ticketData.status === "accepted" ||
            (ticketData.status === "inprogress" && isEditingTechnician) ? (
              <>
                <Select
                  defaultValue={ticketData.technician?.id}
                  onValueChange={async (value) => {
                    try {
                      await handleUpdateTicketDetails({
                        id: ticketData.id,
                        technician_id: value,
                        status: "inprogress",
                      }).unwrap();
                      refetch();
                      toast.success("Technician assigned successfully.");
                      setIsEditingTechnician(false);
                    } catch (error) {
                      console.error("Failed to assign technician:", error);
                      toast.error(
                        "Failed to assign technician. Please try again."
                      );
                    }
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.data?.map((technician) => (
                      <SelectItem
                        key={technician.id}
                        value={technician.id}
                        disabled={
                          technician.availability_status !== "available"
                        }
                      >
                        {technician.name}
                        {technician.availability_status !== "available" &&
                          " (Unavailable)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CircleX
                  className="h-5 w-5 text-gray-600 cursor-pointer"
                  onClick={() => setIsEditingTechnician(false)}
                />
              </>
            ) : (
              <>
                <span>{ticketData.technician?.name || "Unassigned"}</span>
                {ticketData.status === "accepted" ||
                  (ticketData.status === "inprogress" && (
                    <Edit
                      className="h-5 w-5 text-gray-600 cursor-pointer"
                      onClick={() => setIsEditingTechnician(true)}
                    />
                  ))}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Notes and Attachments */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700">Notes</h2>
        <p>{ticketData.notes || "No notes available"}</p>
      </div>

      {ticketData.attachments && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Attachments</h2>
          <p>Attachments available</p>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
