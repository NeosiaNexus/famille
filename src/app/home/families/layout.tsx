"use client";

import React from "react";

export default function FamilySpecificLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
