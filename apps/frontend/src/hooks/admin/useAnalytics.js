"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { useSaveEvent } from "@/services/admin/useAnalyticsService";



export function useAnalytics() {
  // ✅ use your SmartMutation for backend forwarding
  const saveEvent = useSaveEvent()

  useEffect(() => {
    // --- Init PostHog ---
    if (!window.__POSTHOG_INIT__) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY, { api_host: "https://app.posthog.com", capture_pageview: true })
  window.__POSTHOG_INIT__ = true
}

    // posthog.init("YOUR_PROJECT_KEY", {
    //   api_host: "https://app.posthog.com",
    //   capture_pageview: true,
    // });

    // --- Forward captured events to backend ---P
    const forwardEvent = (event) => {
      saveEvent.mutate(event);
    };
    posthog.on("eventCaptured", forwardEvent);

    // --- Scroll depth tracking ---
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent = Math.round((scrollTop / docHeight) * 100);

      if (percent >= 25 && !window._scroll25) {
        posthog.capture("ScrollDepth", { percent: 25 });
        window._scroll25 = true;
      }
      if (percent >= 50 && !window._scroll50) {
        posthog.capture("ScrollDepth", { percent: 50 });
        window._scroll50 = true;
      }
      if (percent >= 100 && !window._scroll100) {
        posthog.capture("ScrollDepth", { percent: 100 });
        window._scroll100 = true;
      }
    };
    window.addEventListener("scroll", handleScroll);

    // --- Time on page tracking ---
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      posthog.capture("TimeOnPage", { duration });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // --- Cleanup ---
    return () => {
      posthog.off("eventCaptured", forwardEvent);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
 