"use client";
import { cloneElement } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { SignInButton } from "@clerk/nextjs";

export default function AuthAction({ children }) {
  const { isAuthenticated } = useAuthGuard();

  if (isAuthenticated) {
    return children;
  }

  // Strip onClick so the action doesn't fire before auth
  const childWithoutAction = cloneElement(children, { onClick: undefined });

  return (
    <SignInButton mode="modal">
      <span className="cursor-pointer">
        {childWithoutAction}
      </span>
    </SignInButton>
  );
}
