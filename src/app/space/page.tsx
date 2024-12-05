"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SpacePage() {
  const { user, loading, checkAuth } = useAuth();

  const [redirecting, setRedirecting] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setRedirecting(true);
        router.push("/auth/login");
      } else {
        setRedirecting(false);
      }
    }
  }, [loading, router, user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (redirecting)
    return <div>Redirection...</div>;

  return (
    <div>
      <div className={"flex flex-col justify-center items-center gap-3 w-full"}>
        <Avatar className={"h-36 w-36 shadow-lg border-2"}>
          <AvatarImage src="/famille.jpg" alt="Image de famille" />
        </Avatar>
        <h3>Ma famille</h3>
        {user && <p>Bonjour, {user.email}</p>}
      </div>
    </div>
  );
}
