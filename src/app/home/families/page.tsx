"use client";

import getUserFamilies from "@/actions/get-user-families-action";
import { FamilleItem } from "@/app/home/families/components";
import { DialogCreateFamily } from "@/components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { IFullFamily } from "@/interfaces/IFamily";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import { toast } from "sonner";

export default function FamiliesPage() {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();

  const [redirecting, setRedirecting] = useState(true);
  const [families, setFamilies] = useState<IFullFamily[]>([]);
  const [loadingFamilies, setLoadingFamilies] = useState(false);

  const handleLoadFamilies = async () => {
    if (!user) {
      toast.error("Impossible de charger les familles sans être connecté.");
      return;
    }

    setLoadingFamilies(true);
    try {
      const fetchedFamilies = await getUserFamilies(user.id);
      setFamilies(fetchedFamilies);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      toast.error("Une erreur est survenue lors du chargement des familles.");
    } finally {
      setLoadingFamilies(false);
    }
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
    <div className={"flex flex-col gap-10"}>
      {/*Header*/}
      <div className="relative w-fit">
        <h1 className="text-white text-2xl font-semibold">Mes familles</h1>
        <div className="w-[110%] bg-blue-700 mt-1 -rotate-3 absolute -top-1 -left-2 h-full -z-10 rounded-sm" />
      </div>

      {/*Chragement*/}
      {loadingFamilies && <p>Chargement des familles...</p>}

      {/*Si pas de famille*/}
      {!loadingFamilies && families.length === 0 && (
        <div className="flex flex-col gap-5">
          <p className="text-white">Vous n&apos;avez pas encore de familles.</p>
          <DialogCreateFamily onCreateFamily={() => handleLoadFamilies()}>
            <Button className={"w-full text-blue-700 bg-white"}>
              <MdGroupAdd /> Créer une famille
            </Button>
          </DialogCreateFamily>
        </div>
      )}

      {/*Si famille*/}
      {!loadingFamilies && families.length > 0 && (
        <div className="flex flex-col gap-5">
          <DialogCreateFamily onCreateFamily={() => handleLoadFamilies()}>
            <Button className={"w-full text-blue-700 bg-white"}>
              <MdGroupAdd /> Ajouter une famille
            </Button>
          </DialogCreateFamily>
          {families.map((family) => (
            <FamilleItem family={family} key={family.id} />
          ))}
        </div>
      )}
    </div>
  );
}
