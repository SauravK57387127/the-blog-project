"use client";


import { useSmartQuery } from "@/utils/useSmartQuery";

export default function AllDraftsList() {
    const { data: drafts, isLoading, error } = useSmartQuery(["all-drafts"], "admin/blogs/drafts");

    if (error) return <div>Error loading drafts: {error.message}</div>;
    
    if (isLoading) return <div>Loading drafts...</div>;
    if (!drafts?.length) return <div>No drafts found</div>;
 
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Drafts</h2>
            <ul className="space-y-3">
                {drafts?.map((draft) => (
                    <li key={draft._id} className="border p-3 rounded m-4">
                        <a
                            href={`/drafts/${draft._id}`}
                            className="text-blue-600 underline"
                        >
                            {draft.title || "Untitled Draft"}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
