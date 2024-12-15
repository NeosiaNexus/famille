"use client";

import getFamilyById from "@/actions/get-family-by-id-action";
import { PageLoader } from "@/components";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FullFamily } from "@/interfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface FamilySpecificPageParams {
  params: { id: string };
}

export default function FamilySpecificPage({
  params,
}: FamilySpecificPageParams) {
  const { id } = params;

  const { loading: userLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState<FullFamily | null>(null);

  const router = useRouter();

  const hasSentMessage = useRef(false);

  const fetchFamily = async () => {
    try {
      const fetchedFamily = await getFamilyById(id);
      setFamily(fetchedFamily);
    } catch (error) {
      router.push("/home/families");
      if (!hasSentMessage.current) {
        toast.error(
          error instanceof Error ? error.message : "Erreur inconnue.",
        );
        hasSentMessage.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, [id]);

  if (loading || !family || userLoading) return <PageLoader loading />;

  return (
    <div className="text-white w-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-center">{family.name}</h1>
        <p className={"italic font-sm text-center"}>
          {family.description || "Aucune description disponible"}
        </p>
      </div>
      <Link
        href={`/home/families/${id}/members`}
        className={`${buttonVariants({ variant: "default" })} w-full`}
      >
        Voir les membres
      </Link>
    </div>
  );
}
