"use client";

import getFamilyById from "@/actions/get-family-by-id-action";
import {
  DialogSendJoinInvitationFamily,
  HeaderHighlight,
  PageLoader,
} from "@/components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { IFullFamily } from "@/interfaces/IFamily";
import { Role } from "@prisma/client";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface FamilySpecificPageParams {
  params: { id: string };
}

export default function SpecificFamilyMembersPage({
  params,
}: FamilySpecificPageParams) {
  const { id } = params;

  const { user, loading: userLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState<IFullFamily | null>(null);

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

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-500";
      case Role.USER:
        return "bg-green-500";
    }
  };

  if (loading || !family || userLoading) return <PageLoader loading />;
  return (
    <div className={"flex flex-col gap-6"}>
      <HeaderHighlight text={"Membres"} />
      <div className={"flex flex-col gap-3"}>
        {family.members.length === 0 && <p>Aucun membre dans la famille.</p>}
        {_.map(family.members, (member) => (
          <div key={member.id} className={"bg-gray-700 p-3 rounded-2xl"}>
            <p className={"flex items-center justify-between gap-6 text-white"}>
              {member.user.pseudo} {user?.id === member.userId && "(Vous)"}
              <span
                className={`${getRoleColor(member.role)} font-light  px-4 py-1 rounded-sm uppercase text-[10px]`}
              >
                {member.role}
              </span>
            </p>
          </div>
        ))}
        <DialogSendJoinInvitationFamily familyId={id}>
          <Button>Inviter un membre</Button>
        </DialogSendJoinInvitationFamily>
      </div>
    </div>
  );
}
