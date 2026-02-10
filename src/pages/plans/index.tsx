import React from "react";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

// Components
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PlansListingPage } from "@/components/sections/plans/plans-table/plans-listing-page";

export default function Page() {
  return (
    <DashboardLayout>
      <PlansListingPage />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resp = await handleProtectRoute(context);
  return resp;
}
