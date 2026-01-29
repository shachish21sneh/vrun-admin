import type { GetServerSidePropsContext } from "next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { OverViewPageView } from "@/components/sections/overview/view";
import { handleProtectRoute } from "@/lib/protectRoute";

export const metadata = {
  title: "Dashboard : Overview",
};

export default function page() {
  return (
    <DashboardLayout>
      <OverViewPageView />
    </DashboardLayout>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resp = await handleProtectRoute(context);
  return resp;
}
