/**
 * Google Analytics utility
 *
 * Production-grade approach:
 * - Measurement ID from env — never hardcoded
 * - pageview() called on every route change via NavigationTracker
 * - event() available for custom events (blog read, share, like etc.)
 * - All calls are no-ops if GA isn't loaded or ID is missing — safe in dev
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Track a page view.
 * Called automatically by NavigationTracker on every route change.
 */
export function pageview(url) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
}

/**
 * Track a custom event.
 * Use for meaningful user actions beyond page views.
 *
 * Examples:
 *   event('blog_read', { blog_slug: 'my-post', reading_time: 5 })
 *   event('blog_liked', { blog_slug: 'my-post' })
 *   event('blog_shared', { method: 'copy_link' })
 *   event('newsletter_subscribed')
 *   event('comment_posted', { blog_slug: 'my-post' })
 */
export function event(action, params = {}) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, params);
}
