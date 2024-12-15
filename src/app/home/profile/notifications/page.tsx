"use client";

import { getUserInvitationsFamilyAction } from "@/actions/get-user-invitations-family-action";
import { responseToFamilyInvitationAction } from "@/actions/response-to-family-invitation-action";
import { HeaderHighlight } from "@/components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { InvitationFamily } from "@/interfaces";
import { InvitationStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileNotificationsPage() {
  const { user } = useAuth();

  const [invitations, setInvitations] = useState<InvitationFamily[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoadInvitations = async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const fetchedInvitations = await getUserInvitationsFamilyAction(
          user.email,
        );
        setInvitations(fetchedInvitations);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du chargement des invitations.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResponseInvitation = (
    invitationFamily: InvitationFamily,
    status: InvitationStatus,
  ) => {
    responseToFamilyInvitationAction(invitationFamily, status)
      .then((data) => {
        setInvitations((prevInvitations) =>
          prevInvitations.filter(
            (invitation) => invitation.id !== invitationFamily.id,
          ),
        );

        if (status === InvitationStatus.ACCEPTED) {
          toast.success(data.message);
        }

        if (status === InvitationStatus.DECLINED) {
          toast.info(data.message);
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la réponse à l'invitation.",
        );
      });
  };

  useEffect(() => {
    handleLoadInvitations();
  }, [user]);

  // Rendu des invitations en attente
  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "PENDING",
  );

  return (
    <div>
      <HeaderHighlight text={"Notifications"} />
      <div className={"pt-6"}>
        {loading && (
          <p className={"text-white text-center"}>
            Chargement des invitations...
          </p>
        )}
        {error && <p className={"text-red-500 text-center"}>{error}</p>}
        {!loading && !error && (
          <>
            {pendingInvitations.length > 0 ? (
              <div className={"flex flex-col gap-4"}>
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className={
                      "bg-blue-300 p-3 rounded-2xl flex flex-col gap-3"
                    }
                  >
                    <p className={"text-black text-center"}>
                      {`${invitation.sender.pseudo} vous invite à rejoindre la famille "${invitation.family.name}"`}
                    </p>
                    <div className={"flex gap-3"}>
                      <Button
                        className={"flex-1"}
                        onClick={() =>
                          handleResponseInvitation(
                            invitation,
                            InvitationStatus.ACCEPTED,
                          )
                        }
                      >
                        Accepter
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() =>
                          handleResponseInvitation(
                            invitation,
                            InvitationStatus.DECLINED,
                          )
                        }
                      >
                        Refuser
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={"text-white text-center"}>
                Vous n&apos;avez aucune notification pour le moment.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
