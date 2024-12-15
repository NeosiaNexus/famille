"use client";

import getUserFamilies from "@/actions/get-user-families-action";
import { DialogCreateFamily, StatCard } from "@/components";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserWithFamily } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaInfo } from "react-icons/fa";
import { MdEventAvailable, MdFamilyRestroom, MdGroupAdd } from "react-icons/md";
import { toast } from "sonner";

export default function SpacePage() {
  const { user, loading, checkAuth } = useAuth();

  const [redirecting, setRedirecting] = useState<boolean>(true);

  const [userFamilies, setuserFamilies] = useState<UserWithFamily | null>(null);

  const router = useRouter();

  const handleLoadFamilies = () => {
    setTimeout(() => {}, 1000);
    if (!user)
      return toast.error(
        "Impossible de charger les familles sans être connecté.",
      );
    getUserFamilies(user.id).then((userWithFamily) => {
      setuserFamilies(userWithFamily);
    });
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setRedirecting(true);
        router.push("/auth/login");
      } else {
        setRedirecting(false);
        handleLoadFamilies();
      }
    }
  }, [loading, router, user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (redirecting) return <div>Redirection...</div>;

  return (
    <div className={"flex flex-col gap-5"}>
      <div className={"flex w-full flex-col items-center justify-center gap-3"}>
        <Avatar className={"h-32 w-32 border-2 shadow-lg"}>
          <AvatarImage src="/famille.jpg" alt="Image de famille" />
        </Avatar>
        <h3 className={"text-white"}>
          Bonjour <span className={"text-blue-300"}>{user?.pseudo}</span> !
        </h3>
      </div>
      <div className={"flex gap-5 flex-row justify-center flex-wrap "}>
        <StatCard
          Icon={MdFamilyRestroom}
          value={!userFamilies ? 0 : userFamilies?.families.length}
          label={
            "Famille" +
            (userFamilies && userFamilies.families.length > 1 ? "s" : "")
          }
          href={"/home/families"}
        />
        <StatCard Icon={MdEventAvailable} value={52} label={"Evènements"} />
      </div>
      <div>
        <DialogCreateFamily onCreateFamily={() => handleLoadFamilies()}>
          <Button className={"w-full bg-blue-700"}>
            <MdGroupAdd /> Créer une famille
          </Button>
        </DialogCreateFamily>
      </div>
      <div className="mt-5 flex items-center space-x-4 rounded-md border bg-blue-50 p-4">
        <FaInfo />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">Version BETA</p>
          <p className="text-sm text-muted-foreground">
            L&lsquo;application est en version BETA, des bugs peuvent survenir.
          </p>
        </div>
      </div>
    </div>
  );
}
