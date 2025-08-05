"use client";


import { useSmartQuery } from "@/utils/useSmartQuery";

export default function AllDraftsList() {
    const { data: drafts } = useSmartQuery(
        ["all-drafts"],
        "/api/admin/blogs/drafts",
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Drafts</h2>
            <ul className="space-y-3">
                {drafts?.map((draft) => (
                    <li key={draft._id} className="border p-3 rounded">
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
