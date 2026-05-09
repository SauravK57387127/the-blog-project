"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/analytics";

/**
 * NavigationTracker
 *
 * Why this exists:
 * Next.js App Router is a SPA — navigating between pages doesn't reload the browser.
 * GA's default script only fires once on initial load. Without this component,
 * GA would only see the first page visit, not subsequent navigations.
 *
 * This component listens to pathname + searchParams changes and fires
 * GA's pageview on every navigation — making GA aware of every page the user visits.
 *
 * Must be wrapped in Suspense because useSearchParams() requires it in App Router.
 */
function NavigationTrackerInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url =
            pathname +
            (searchParams.toString() ? `?${searchParams.toString()}` : "");
        pageview(url);
    }, [pathname, searchParams]);

    return null; // renders nothing — side-effect only
}

export function NavigationTracker() {
    return (
        <Suspense fallback={null}>
            <NavigationTrackerInner />
        </Suspense>
    );
}
