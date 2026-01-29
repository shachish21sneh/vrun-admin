import React from "react";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

// Components
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MasterCarModelsListingPage } from "@/components/sections/master-car-models/views";

export default function Page() {
  return (
    <DashboardLayout>
      <MasterCarModelsListingPage />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resp = await handleProtectRoute(context);
  return resp;
}