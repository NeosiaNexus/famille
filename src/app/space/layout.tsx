import React from "react";

import type { Metadata } from "next";

import { SidebarProvider } from "@/components/ui/sidebar";

import { SideBar, Navbar } from "@/components";

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
      <SideBar />
      <main>
        <Navbar />
        <div
          className={
            "h-screen w-screen overflow-y-auto overflow-x-hidden pb-3 pl-14 pr-14 pt-3"
          }
        >
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
