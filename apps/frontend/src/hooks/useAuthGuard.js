"use client";

import { useUser } from "@clerk/nextjs";

export function useAuthGuard() {
  const { isSignedIn, user, isLoaded } = useUser();

  return {
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded,
    user,
    userId: user?.id ?? null,
  };
}
