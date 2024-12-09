import { create } from "zustand";
import { toast } from "sonner";

export type User = {
  id: string;
  email: string;
  pseudo: string;
};

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  // Vérification d'authentification
  checkAuth: async () => {
    set({ loading: true }); // Commence le chargement
    try {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...user } = result.user;
        set({ user: user }); // Met à jour l'utilisateur
      } else {
        set({ user: null });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ user: null });
    } finally {
      set({ loading: false }); // Fin du chargement
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la déconnexion.");
    }
  },
}));

export default useAuthStore;
