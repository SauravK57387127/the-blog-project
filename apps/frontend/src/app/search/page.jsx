import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Search from "@/ui-pages/Search";
import { apiBaseUrl } from "@/config";
 
async function getSearchInitialData() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/public/search/initial`, {
      next: { revalidate: 300 }, // ISR — tags + popular reads change slowly, 5 min cache
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}
 
export default async function SearchPage() {
  const initialData = await getSearchInitialData();
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppLayout>
        <Search initialData={initialData} />
      </AppLayout>
    </Suspense>
  );
}
