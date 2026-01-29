import React from "react";
import type { GetServerSidePropsContext } from "next";

import { handleProtectRoute } from "@/lib/protectRoute";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { UsersListingPage } from "@/components/sections/users/views";

export const metadata = {
  title: "Dashboard : Users",
};

export default function Page() {
  return (
    <DashboardLayout>
      <UsersListingPage />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resp = await handleProtectRoute(context);
  return resp;
}
