import React from "react";

import type { Metadata } from "next";

import { Poppins } from "next/font/google";

import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "MaFamille",
  description: "Gérer facilement votre emplois du temps familial",
};

const poppins = Poppins({
  weight: [
    "100",
    "200",
    "300",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${poppins.className} h-screen w-screen overflow-y-auto overflow-x-hidden bg-gray-950`}
      >
        <Toaster expand={true} richColors={true} />
        {children}
      </body>
    </html>
  );
}
