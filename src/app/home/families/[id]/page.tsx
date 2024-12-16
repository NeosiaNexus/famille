"use client";

import getFamilyById from "@/actions/get-family-by-id-action";
import {
  DialogSendJoinInvitationFamily,
  HeaderHighlight,
  PageLoader,
} from "@/components";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FullFamily } from "@/interfaces";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiUserAdd } from "react-icons/hi";
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
    <div className="text-white w-full flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-center">{family.name}</h1>
        <p className={"italic font-sm text-center"}>
          {family.description || "Aucune description disponible"}
        </p>
      </div>
      <div className={"flex gap-1"}>
        <Link
          href={`/home/families/${id}/members`}
          className={`${buttonVariants({ variant: "default" })} w-full`}
        >
          Voir les membres
        </Link>
        <DialogSendJoinInvitationFamily familyId={family.id}>
          <Button
            variant={"outline"}
            className={"text-primary"}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <HiUserAdd />}
          </Button>
        </DialogSendJoinInvitationFamily>
      </div>
      <div className={"flex flex-col gap-10 mt-8"}>
        <HeaderHighlight text={"Evènements à venir"} />
        <div className={"flex flex-col gap-4"}>
          {family.events.length === 0 ? (
            <div className={"flex flex-col gap-4"}>
              <p className={"text-center"}>Aucun évènement à venir.</p>
              {/*<DialogCreateFamilyEvent>*/}
              <Button
                variant={"secondary"}
                onClick={() =>
                  toast.info(
                    "La création d'un évènement familial sera très prochainement disponible",
                  )
                }
              >
                Créer un évènement
              </Button>
              {/*</DialogCreateFamilyEvent>*/}
            </div>
          ) : (
            family.events.map((event) => (
              <div
                key={event.id}
                className={"bg-blue-300 p-3 rounded-2xl flex flex-col gap-3"}
              >
                <p className={"text-black text-center"}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </p>
                <p className={"text-center"}>{event.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
