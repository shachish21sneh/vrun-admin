import React from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import PersonalInfo from "@/components/sections/merchants/PersonalInfo";
import { merchantsApi } from "@/toolkit/merchants/merchants.api";
import ContactPersonCard from "@/components/sections/merchants/ContactPersonCard";
import MerchantTicketsListingPage from "@/components/sections/merchants/tickets-tables/merchant-tickets-listing-page";
interface Tab {
  name: string;
  key: string;
}

const tabs: Tab[] = [
  { name: "Merchant details", key: "userDetails" },
  { name: "Contact person", key: "contactPerson" },
  { name: "Tickets history", key: "ticket" },
];

export default function Page(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  const { useGetMerchantDetailsQuery } = merchantsApi;
  const { data } = useGetMerchantDetailsQuery({
    id: id as string,
  });
  const userData = data;

  const contactPerson = data?.contact_persons;

  return (
    <DashboardLayout>
      <div className="space-y-4 px-8">
        <div className="flex items-start justify-between">
          <Heading
            title={`${userData?.business_name ?? "N/A"} `}
            description="Merchant"
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

          <TabsContent value="contactPerson">
            {contactPerson ? (
              <ContactPersonCard contactPerson={contactPerson} />
            ) : (
              <p>No data available</p>
            )}
          </TabsContent>
          <TabsContent value="ticket">
            {data && <MerchantTicketsListingPage userId={data?.user_id} />}
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
