import { Role } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  pseudo: string;
  emailVerified: Date | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

interface AuthStore {
  user: User | null;
  loading: boolean;
  isChecking: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsChecking: (isChecking: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  isChecking: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setIsChecking: (isChecking) => set({ isChecking }),

  // Vérification d'authentification
  checkAuth: async () => {
    const { isChecking, setIsChecking, setLoading, setUser } = get();

    if (isChecking) return;
    setIsChecking(true);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...user } = result.user;
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la validation de la session.",
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        setIsChecking(false);
      }, 1000);
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        set({ user: null });
        toast.success("Déconnexion réussie.");
      } else {
        toast.error("Une erreur est survenue lors de la déconnexion.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la déconnexion.",
      );
    }
  },
}));

export default useAuthStore;
