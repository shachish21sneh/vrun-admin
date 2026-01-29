import React from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ticketsApi } from "@/toolkit/tickets/tickets.api";
import TicketDetails from "@/components/sections/tickets/TicketDetails";
import CarInfo from "@/components/sections/tickets/CarInfo";
import LocationInfo from "@/components/sections/tickets/LocationInfo";

interface Tab {
  name: string;
  key: string;
}

const tabs: Tab[] = [
  { name: "Ticket details", key: "ticketDetails" },
  { name: "Car information", key: "carDetails" },
  { name: "Location information", key: "locationDetails" },
];

export default function Page(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  const { useGetTicketDetailsQuery } = ticketsApi;
  const { data, refetch } = useGetTicketDetailsQuery({
    id: id as string,
  });

  const ticketData = data;
  const carData = data?.car;
  const locationData = data?.location;

  return (
    <DashboardLayout>
      <div className="space-y-4 px-8">
        <div className="flex items-start justify-between">
          <Heading title="" description="Ticket" />
        </div>
        <Separator />
        <Tabs defaultValue="ticketDetails" className="w-full">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="ticketDetails">
            {ticketData ? (
              <TicketDetails ticketData={ticketData} refetch={refetch} />
            ) : (
              "Ticket details not available"
            )}
          </TabsContent>
          <TabsContent value="carDetails">
            {carData ? <CarInfo carData={carData} /> : "No car data available"}
          </TabsContent>
          <TabsContent value="locationDetails">
            {locationData ? (
              <LocationInfo address={locationData} />
            ) : (
              "No location data available"
            )}
          </TabsContent>
          {/* Add other TabsContent components for other tabs here */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resp = await handleProtectRoute(context);
  return resp;
}
