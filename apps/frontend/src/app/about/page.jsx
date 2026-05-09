import About from "@/ui-pages/About";
import AppLayout from "@/components/layout/AppLayout";
import { apiBaseUrl } from "@/config";

async function getAuthorData() {
    try {
        const res = await fetch(`${apiBaseUrl}/api/public/authors/me`, {
            next: { revalidate: 3600 }, // ISR — 1 hour, matches useActiveAuthor staleTime
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch {
        return null;
    }
}

export async function generateMetadata() {
    const author = await getAuthorData(); // Next.js deduplicates — same fetch, one network call
    return {
        title: `About | ${author?.name ?? "Saurav Kumar Yadav"}`,
        description:
            author?.bio?.slice(0, 160) ??
            "Self-taught developer writing about code, life, and growth.",
        openGraph: {
            title: `About | ${author?.name ?? "Saurav Kumar Yadav"}`,
            description:
                author?.bio?.slice(0, 160) ??
                "Self-taught developer writing about code, life, and growth.",
            ...(author?.profileImage && {
                images: [{ url: author.profileImage }],
            }),
        },
    };
}

export default async function AboutPage() {
    const author = await getAuthorData();
    return (
        <AppLayout>
            <About author={author} />
        </AppLayout>
    );
}
