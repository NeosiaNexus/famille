"use client";

import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { Navbar, SideBar } from "@/components";
import AuthProtection from "@/components/AuthProtection/AuthProtection";

export default function SpaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProtection requiredAuth={true}>
      <SidebarProvider defaultOpen={false}>
        <SideBar />
        <main className={"flex justify-center items-center"}>
          <Navbar />
          <div
            className={
              "w-screen h-screen flex justify-center  overflow-x-hidden"
            }
          >
            <div className={"overflow-y-auto pb-3 pl-14 pr-14 pt-14"}>
              <>{children}</>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </AuthProtection>
  );
}
