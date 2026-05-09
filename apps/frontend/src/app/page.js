import PublicHomeWrapper from "@/components/PublicHomeWrapper";
import AppLayout from "@/components/layout/AppLayout";
import { apiBaseUrl } from "@/config";

async function getHomepageData() {
    try {
        const res = await fetch(`${apiBaseUrl}/api/public/homepage`, {
            next: { revalidate: 120 }, // ISR — rebuild cache every 2 minutes
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data; // unwrap { success, message, data } — same as axios interceptor
    } catch {
        return null; // graceful fallback — wrapper handles null data
    }
}

export default async function Home() {
    const data = await getHomepageData();

    return (
        <AppLayout>
            <PublicHomeWrapper data={data} />
        </AppLayout>
    );
}
