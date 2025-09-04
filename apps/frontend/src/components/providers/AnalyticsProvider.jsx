// src/app/providers/AnalyticsProvider.js (client component)
"use client"
import { useAnalytics } from "@/hooks/admin/useAnalytics"


export default function AnalyticsProvider({ children }) {
  useAnalytics()
  return <>{children}</>
}
