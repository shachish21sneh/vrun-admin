import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";

interface Tab {
  name: string;
  key: string;
}

const tabs: Tab[] = [
  { name: "Profile", key: "profile" },
  { name: "Change Password", key: "changePassword" },
];

const AccountTemplate = () => {
  return (
    <div className="space-y-4 px-8">
      <div className="flex items-start justify-between">
        <Heading
          title="Account"
          description="Manage your account settings and preferences."
        />
      </div>
      <Separator />
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="changePassword">
          <ChangePassword />
        </TabsContent>

        {/* Add other TabsContent components for other tabs here */}
      </Tabs>
    </div>
  );
};

export default AccountTemplate;
