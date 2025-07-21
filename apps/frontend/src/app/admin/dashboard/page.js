import { RecentActivity, StatsCards, TopBlogs, RefreshButton, AnalyticsPreview } from "@/components/admin/dashboard";





export default function AdminDashboardPage() {
  return (
    <div>
      {/* Import and render your components here */}
        <RecentActivity />
        <StatsCards />
        <TopBlogs />
        <RefreshButton />
        <AnalyticsPreview />
    </div>
  );
}
