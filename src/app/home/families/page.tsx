"use client";

import getUserFamilies from "@/actions/get-user-families-action";
import { FamilleItem } from "@/app/home/families/components";
import { DialogCreateFamily, HeaderHighlight } from "@/components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserWithFamily } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import { toast } from "sonner";

export default function FamiliesPage() {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();

  const [redirecting, setRedirecting] = useState(true);
  const [userWithFamilies, setUserWithFamilies] =
    useState<UserWithFamily | null>(null);
  const [loadingFamilies, setLoadingFamilies] = useState(false);

  // Charger les familles
  const loadFamilies = async () => {
    if (!user) {
      toast.error("Impossible de charger les familles sans être connecté.");
      return;
    }

    setLoadingFamilies(true);
    try {
      const fetchedFamilies = await getUserFamilies(user.id);
      setUserWithFamilies(fetchedFamilies);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(errorMessage);
    } finally {
      setLoadingFamilies(false);
    }
  };

  // Gestion de l'authentification et redirection
  useEffect(() => {
    if (!loading) {
      if (!user) {
        setRedirecting(true);
        router.push("/auth/login");
      } else {
        setRedirecting(false);
        loadFamilies();
      }
    }
  }, [loading, user, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (redirecting) return <div>Redirection...</div>;

  return (
    <div className="flex flex-col gap-10">
      <HeaderHighlight text="Mes familles" />

      {loadingFamilies ? (
        <p>Chargement des familles...</p>
      ) : (
        <FamiliesContent
          families={userWithFamilies?.families ?? []}
          onReload={loadFamilies}
        />
      )}
    </div>
  );
}

// Sous-composant pour le contenu des familles
function FamiliesContent({
  families,
  onReload,
}: {
  families: UserWithFamily["families"];
  onReload: () => void;
}) {
  if (families.length === 0) {
    return <NoFamiliesPlaceholder onCreateFamily={onReload} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <DialogCreateFamily onCreateFamily={onReload}>
        <Button className="w-full text-blue-700 bg-white">
          <MdGroupAdd /> Ajouter une famille
        </Button>
      </DialogCreateFamily>
      {families.map((family) => (
        <FamilleItem family={family} key={family.id} />
      ))}
    </div>
  );
}

// Sous-composant pour le placeholder "Pas de familles"
function NoFamiliesPlaceholder({
  onCreateFamily,
}: {
  onCreateFamily: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-white">Vous n&apos;avez pas encore de familles.</p>
      <DialogCreateFamily onCreateFamily={onCreateFamily}>
        <Button className="w-full text-blue-700 bg-white">
          <MdGroupAdd /> Créer une famille
        </Button>
      </DialogCreateFamily>
    </div>
  );
}
