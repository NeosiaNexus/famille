"use client";

import React, { useEffect } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AuthProtection, Navbar, SideBar } from "@/components";
import { CUSTOM_NOTIFICATION } from "@/constants/socketChannel";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/socket";
import { toast } from "sonner";

export default function SpaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  useEffect(() => {
    const listenChannels = [CUSTOM_NOTIFICATION];
    if (socket) {
      socket.on(listenChannels[0], (data) => {
        if (data.userId === user?.id || data.email === user?.email) {
          toast.info(data.message);
        }
      });
      return () => {
        listenChannels.forEach((channel) => {
          socket.off(channel);
        });
      };
    }
  }, [user]);

  return (
    <AuthProtection requiredAuth={true}>
      <SidebarProvider defaultOpen={false}>
        <SideBar />
        <main className={"flex justify-center items-center"}>
          <Navbar />
          <div
            className={
              "w-screen h-screen flex justify-center overflow-x-hidden"
            }
          >
            <div className={"overflow-y-auto pb-3 pl-14 pr-14 pt-20"}>
              <>{children}</>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </AuthProtection>
  );
}
