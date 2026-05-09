"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setTokenGetter } from "@/lib/auth-token";

/**
 * Registers Clerk's getToken with the axios interceptor.
 * Must be rendered inside <ClerkProvider> — place in root layout.
 *
 * Usage:
 *   <ClerkProvider>
 *     <TokenInitializer />
 *     {children}
 *   </ClerkProvider>
 */
export function TokenInitializer() {
    const { getToken } = useAuth();

    useEffect(() => {
        setTokenGetter(() => getToken());
    }, [getToken]);

    return null;
}
