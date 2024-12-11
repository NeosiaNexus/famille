import { PageLoader } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthProtectionProps {
  requiredRole?: Role;
  requiredAuth?: boolean;
  children: React.ReactNode;
}

const AuthProtection: React.FC<AuthProtectionProps> = ({
  requiredRole = null,
  requiredAuth = true,
  children,
}) => {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  let requiredRoleCheck = false;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading) {
      if (requiredAuth && !user) {
        router.push("/auth/login");
        return;
      }
      if (!requiredRoleCheck && requiredRole && user?.role !== requiredRole) {
        requiredRoleCheck = true;
        router.push("/home");
        toast.error(
          "Vous n'avez pas les droits nécessaires pour accéder à cette page.",
        );
        return;
      }
      setIsLoading(false);
    }
  }, [loading, requiredAuth, requiredRole, router, user]);

  if (isLoading) return <PageLoader loading={true} />;

  return <>{children}</>;
};

export default AuthProtection;
