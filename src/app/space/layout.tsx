import React from "react";

import type { Metadata } from "next";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import CustomSidebarTrigger from "@/components/CustomSidebarTrigger";

export const metadata: Metadata = {
  title: "MaFamille",
  description: "Gérer facilement votre emplois du temps familial",
};

export default function SpaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <CustomSidebarTrigger />
        <div className={"w-screen h-screen overflow-x-hidden overflow-y-auto pl-14 pr-14 pt-3 pb-3"}>{children}</div>
      </main>
    </SidebarProvider>
  );
}
