import { createInvitationFamilyAction } from "@/actions/create-invitation-family-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface StatCardProps {
  familyId: string;
  children: React.ReactNode;
  onInviteUser?: () => void;
}

type FormDataType = {
  message: string;
  invitedEmail: string;
};

const DialogSendJoinInvitationFamily: React.FC<StatCardProps> = ({
  familyId,
  children,
  onInviteUser = () => {},
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    message: "",
    invitedEmail: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { loading: userLoading, user } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userLoading || !user)
      toast.error("Impossible d'envoyer une invitation sans être connecté.");

    const finalFormData = new FormData();

    finalFormData.append("message", formData.message);
    finalFormData.append("invitedEmail", formData.invitedEmail);
    finalFormData.append("senderId", user?.id as string);
    finalFormData.append("familyId", familyId);

    setLoading(true);

    createInvitationFamilyAction()
      .then(() => {
        toast.success(
          `L'utilisateur "${formData.invitedEmail}" a été invité avec succès !`,
        );
        setFormData({ invitedEmail: "", message: "" });
        onInviteUser();
        setIsModalOpen(false);
      })
      .catch((error) => {
        if (error instanceof Error) toast.error(error.message);
        else
          toast.error(
            "Une erreur est survenue lors de l'envoi de l'invitation.",
          );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={isModalOpen} modal={true}>
      <DialogTrigger asChild onClick={() => setIsModalOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Agrandissez votre famille en invitant un nouveau membre.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="invitedEmail" className="text-right">
              Email
            </Label>
            <Input
              id="invitedEmail"
              name={"invitedEmail"}
              value={formData.invitedEmail}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              name={"message"}
              value={formData.message}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter className={"flex flex-row gap-5"}>
          <Button
            type="button"
            className={"bg-red-700 flex-1"}
            onClick={() => setIsModalOpen(false)}
            disabled={loading || userLoading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Annuler
          </Button>
          <Button
            type="button"
            className={"bg-blue-700 flex-1"}
            onClick={handleSubmit}
            disabled={loading || userLoading}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Invitation en cours..." : "Inviter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSendJoinInvitationFamily;
