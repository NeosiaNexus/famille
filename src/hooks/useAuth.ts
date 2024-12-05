"use client";

import useAuthStore from "@/stores/authStore";

export function useAuth() {
  const { user, loading, checkAuth, logout, setUser, setLoading } =
    useAuthStore();

  return { user, loading, checkAuth, logout, setLoading, setUser };
}
