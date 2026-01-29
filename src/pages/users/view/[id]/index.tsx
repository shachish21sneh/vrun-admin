import React from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfo from "@/components/sections/users/PersonalInfo";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { customersApi } from "@/toolkit/customers/customers.api";
import UserRegisteredCars from "@/components/sections/users/UserRegisteredCars";
import UserLocation from "@/components/sections/users/UserLocation";
import UserTicketsListingPage from "@/components/sections/users/tickets-tables/tickets-listing-page";

interface Tab {
  name: string;
  key: string;
}

const tabs: Tab[] = [
  { name: "User details", key: "userDetails" },
  { name: "Registered cars", key: "registeredCars" },
  { name: "Registered addresses", key: "registeredAddresses" },
  { name: "Ticket history", key: "ticketHistory" },
  // { name: "Attachment", key: "attachment" },
  // { name: "Activity", key: "activity" },
];

export default function Page(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  const { useGetCustomerDetailsQuery } = customersApi;

  const { data } = useGetCustomerDetailsQuery({
    id: id as string,
  });
  const userData = data?.profile;
  const userCarsData = data?.cars;
  const userAddressesData = data?.user_locations;
  const userTicketHistoryData = data?.tickets;

  return (
    <DashboardLayout>
      <div className="space-y-4 px-8">
        <div className="flex items-start justify-between">
          <Heading
            title={`${userData?.first_name ?? "N/A"} ${
              userData?.last_name ?? "N/A"
            }`}
            description="User"
          />
        </div>
        <Separator />
        <Tabs defaultValue="userDetails" className="w-full">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="userDetails">
            {userData ? (
              <PersonalInfo userData={userData} />
            ) : (
              <p>No data available</p>
            )}
          </TabsContent>
          <TabsContent value="registeredCars">
            {userCarsData ? (
              <UserRegisteredCars userCarsData={userCarsData} />
            ) : (
              <p>No data available</p>
            )}
          </TabsContent>
          <TabsContent value="registeredAddresses">
            {userAddressesData ? (
              <UserLocation userAddressesData={userAddressesData} />
            ) : (
              <p>No data available</p>
            )}
          </TabsContent>
          <TabsContent value="ticketHistory">
            {userTicketHistoryData ? (
              <UserTicketsListingPage
                userTicketHistoryData={userTicketHistoryData}
              />
            ) : (
              <p>No data available</p>
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
