import React from "react";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

// Components
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MasterSunroofProblemsListingPage } from "@/components/sections/master-sunroof-problems/views";

export default function Page() {
  return (
    <DashboardLayout>
      <MasterSunroofProblemsListingPage />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resp = await handleProtectRoute(context);
  return resp;
}