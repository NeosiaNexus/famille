import { getUserInvitationsFamilyAction } from "@/actions/get-user-invitations-family-action";
import { SideBarTrigger } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CUSTOM_NOTIFICATION } from "@/constants/socketChannel";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/socket";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";

const Navbar = () => {
  const { user, setUser, setLoading } = useAuth();

  const [invitations, setInvitations] = useState<number>(0);

  const handleLogout = () => {
    setLoading(true);
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Déconnexion réussie.");
          setUser(null);
        } else {
          toast.error("Une erreur est survenue lors de la déconnexion.");
        }
      })
      .catch((error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Erreur lors de la déconnexion.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (socket && user) {
      socket.on(CUSTOM_NOTIFICATION, () => {
        getUserInvitationsFamilyAction(user.email).then((invitations) =>
          setInvitations(
            invitations.filter((invitation) => invitation.status === "PENDING")
              .length,
          ),
        );
      });
    }
  }, [user]);

  return (
    <div>
      <div className={"absolute left-2 top-3"}>
        <SideBarTrigger />
      </div>
      <div className={"absolute right-1.5 top-2"}>
        <Popover>
          <PopoverTrigger>
            {invitations > 0 && (
              <Badge
                className={
                  "absolute right-8 -top-0.5 z-10 bg-red-500 h-5 w-5 rounded-full flex justify-center items-center"
                }
              >
                {invitations}
              </Badge>
            )}
            <span
              className={
                "absolute right-1 top-1 overflow-hidden rounded-full p-4 text-black bg-white shadow-md"
              }
            >
              <FaUser />
            </span>
          </PopoverTrigger>
          <PopoverContent
            className={
              "w-fit fixed top-9 right-1.5 bg-white/60 backdrop-blur-xl"
            }
          >
            <div
              className={
                "flex flex-col justify-center items-center gap-5 w-fit"
              }
            >
              <Link href={"/home/profile/account"}>Mon profil</Link>
              <Link
                href={"/home/profile/notifications"}
                className={"flex gap-1 items-center"}
              >
                Notification{invitations > 0 && "s"}
                {invitations > 0 && (
                  <Badge
                    className={
                      "bg-red-500 h-5 w-5 rounded-full flex justify-center items-center"
                    }
                  >
                    {invitations}
                  </Badge>
                )}
              </Link>
              <Button onClick={handleLogout}>Déconnexion</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
