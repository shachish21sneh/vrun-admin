import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MerchantsListingPage } from "@/components/sections/merchants/views";

export default function Page() {
  return (
    <DashboardLayout>
     <MerchantsListingPage/>
    </DashboardLayout>
  );
}
