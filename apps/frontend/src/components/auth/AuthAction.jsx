"use client";
import { cloneElement, useEffect, useRef } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { SignInButton } from "@clerk/nextjs";

export default function AuthAction({
    children,
    onAuthenticated,
    actionKey,
    readyToReplay = true,
}) {
    const { isAuthenticated } = useAuthGuard();

    const onAuthenticatedRef = useRef(onAuthenticated);
    useEffect(() => {
        onAuthenticatedRef.current = onAuthenticated;
    });

    useEffect(() => {
        if (!isAuthenticated || !readyToReplay || !actionKey) return;

        const pending = sessionStorage.getItem("pendingAuthAction");
        if (pending !== actionKey) return;

        sessionStorage.removeItem("pendingAuthAction");
        onAuthenticatedRef.current?.();
    }, [isAuthenticated, readyToReplay, actionKey]);

    if (isAuthenticated) return children;

    const childWithoutAction = cloneElement(children, {
        onClick: () => {
            if (actionKey)
                sessionStorage.setItem("pendingAuthAction", actionKey);
        },
    });

    return (
        <SignInButton
            mode="modal"
            forceRedirectUrl={
                typeof window !== "undefined" ? window.location.href : "/"
            }
        >
            <span className="cursor-pointer">{childWithoutAction}</span>
        </SignInButton>
    );
}
