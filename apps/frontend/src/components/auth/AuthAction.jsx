"use client";
import { cloneElement, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { SignInButton } from "@clerk/nextjs";

export default function AuthAction({ children, onAuthenticated, actionKey }) {
  const { isAuthenticated } = useAuthGuard();

  useEffect(() => {
    if (isAuthenticated && actionKey) {
      const pending = sessionStorage.getItem("pendingAuthAction");
      if (pending === actionKey) {
        sessionStorage.removeItem("pendingAuthAction");
        onAuthenticated?.();
      }
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return children;

  const childWithoutAction = cloneElement(children, {
    onClick: () => {
      if (actionKey) {
        sessionStorage.setItem("pendingAuthAction", actionKey);
      }
    },
  });

  return (
    <SignInButton
      mode="modal"
      forceRedirectUrl={typeof window !== "undefined" ? window.location.href : "/"}
    >
      <span className="cursor-pointer">{childWithoutAction}</span>
    </SignInButton>
  );
}
