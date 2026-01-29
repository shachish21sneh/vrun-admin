import React from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { techniciansApi } from "@/toolkit/technicians/technicians.api";
import PersonalInfo from "@/components/sections/technicians/PersonalInfo";

interface Tab {
  name: string;
  key: string;
}

const tabs: Tab[] = [{ name: "Technician details", key: "userDetails" }];

export default function Page(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  const { useGetTechniciansDetailsQuery } = techniciansApi;
  const { data } = useGetTechniciansDetailsQuery({
    id: id as string,
  });
  const userData = data;

  return (
    <DashboardLayout>
      <div className="space-y-4 px-8">
        <div className="flex items-start justify-between">
          <Heading
            title={`${userData?.name ?? "N/A"} `}
            description="Technician"
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
