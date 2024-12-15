"use client";

import { PageLoader } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, checkAuth } = useAuth();

  const [redirecting, setRedirecting] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        setRedirecting(true);
        router.push("/home");
      } else {
        setRedirecting(false);
      }
    }
  }, [loading, router, user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <PageLoader loading={loading || redirecting} />
      {!user && !loading && !redirecting && children}
    </>
  );
}
