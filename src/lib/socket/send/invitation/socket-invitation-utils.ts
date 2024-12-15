import { InvitationFamily } from "@/interfaces";
import { sendNotificationByEmail } from "@/lib/socket/socketUtils";

export const sendInvitation = (email: string, invitation: InvitationFamily) => {
  sendNotificationByEmail(
    email,
    `Vous avez reçu une invitation à rejoindre la famille "${invitation.family.name}" de la part de ${invitation.sender.pseudo} (${invitation.sender.email}).`,
  );
};
