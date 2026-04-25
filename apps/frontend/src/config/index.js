const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
  posthogApiHost: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
  posthogApiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, // ← add this
}
export const { posthogApiKey, apiBaseUrl, posthogApiHost, clerkPublishableKey, gaMeasurementId } = config;
