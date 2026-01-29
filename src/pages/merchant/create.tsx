import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateMerchantPage from "@/components/sections/merchants/views/CreateMerchantPage";

export default function Page() {
  return (
    <DashboardLayout>
      <CreateMerchantPage />
    </DashboardLayout>
  );
}
