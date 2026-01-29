import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeeForm from "@/components/sections/users/user-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  return (
    <DashboardLayout>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          {/* <Breadcrumbs items={breadcrumbItems} /> */}
          <EmployeeForm />
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
}
