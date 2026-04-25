'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

/**
 * useViewTracking
 *
 * Handles the full view lifecycle for a blog page:
 * 1. On mount  → POST /api/public/blogs/:slug/view (initial view)
 * 2. On scroll → tracks scroll depth in memory (no API calls per scroll)
 * 3. On exit   → POST /api/public/views/update via sendBeacon (reliable on page close)
 *
 * Why sendBeacon for exit:
 * - fetch/axios get cancelled when page unloads — sendBeacon does not
 * - Works on mobile (where beforeunload is unreliable)
 * - Fire and forget — never blocks the user
 *
 * History flow:
 * - Authenticated users: userId sent → BlogView.userId populated
 *   → history.service finds these views for reading history tab
 * - Anonymous users: no userId → views tracked for counts but not in history
 */
export function useViewTracking(slug, blogId) {
  const { user, isLoaded } = useUser();
  const sessionIdRef    = useRef(null); // server-generated sessionId returned from track call
  const scrollDepthRef  = useRef(0);
  const startTimeRef    = useRef(Date.now());
  const trackedRef      = useRef(false);

  // ── 1. Track initial view on mount ──────────────────────────────────────
  useEffect(() => {
    // Wait for Clerk to load so we know if user is authenticated
    if (!slug || !isLoaded || trackedRef.current) return;
    trackedRef.current = true;

    const track = async () => {
      try {
        const result = await apiClient.post(
          `/api/public/blogs/${slug}/view`,
          {
            // Send clerkId if authenticated — enables history + dedup by user
            userId:   user?.id ?? null,
            referrer: document.referrer || null,
            device:   /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          }
        );

        // Store server-generated sessionId for the exit update call
        if (result?.data?.sessionId) {
          sessionIdRef.current = result.data.sessionId;
        }
      } catch {
        // Fire and forget — view tracking should never break the page
      }
    };

    track();
  }, [slug, isLoaded, user?.id]);

  // ── 2. Track scroll depth ────────────────────────────────────────────────
  useEffect(() => {
    if (!blogId) return;

    const handleScroll = () => {
      const el      = document.documentElement;
      const scrolled = el.scrollTop + el.clientHeight;
      const total   = el.scrollHeight;
      const depth   = Math.min(Math.round((scrolled / total) * 100), 100);
      if (depth > scrollDepthRef.current) {
        scrollDepthRef.current = depth;
      }
    };

    // passive: true — never blocks scroll, zero performance cost
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blogId]);

  // ── 3. Send update on page exit ──────────────────────────────────────────
  useEffect(() => {
    if (!blogId || !slug) return;

    const sendUpdate = () => {
      if (!sessionIdRef.current) return; // no sessionId = view wasn't tracked, skip

      const timeSpent   = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const scrollDepth = scrollDepthRef.current;
      const completed   = scrollDepth >= 80; // 80%+ scroll = "read"

      const payload = JSON.stringify({
        blogId,
        sessionId:   sessionIdRef.current,
        timeSpent,
        scrollDepth,
        completed,
      });

      // sendBeacon is the only reliable way to fire a request on page exit
      // It works even when the page is being closed/navigated away
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          `${process.env.NEXT_PUBLIC_API_URL}/api/public/views/update`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };

    // visibilitychange catches mobile tab switches + navigation better than beforeunload
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendUpdate();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', sendUpdate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendUpdate);
    };
  }, [blogId, slug]);
}
