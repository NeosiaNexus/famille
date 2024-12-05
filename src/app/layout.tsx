import React from "react";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MaFamille",
  description: "Gérer facilement votre emplois du temps familial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={"w-screen h-screen overflow-x-hidden overflow-y-auto"}>
        {children}
      </body>
    </html>
  );
}
