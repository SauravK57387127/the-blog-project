"use client";

import { useAllDrafts } from "@/services/admin/useDraftsService";
import Link from "next/link";


export default function AllDraftsList() {
const { data: res, isLoading, error } = useAllDrafts();
const drafts = res?.data;

    if (error) return <div>Error loading drafts: {error.message}</div>;
    
    if (isLoading) return <div>Loading drafts...</div>;
    // if (!drafts?.length) return <div>No drafts found</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Drafts</h2>
            <ul className="space-y-3">
                {drafts?.map((draft) => (
                    <li key={draft._id} className="border p-3 rounded m-4">
                        <Link href={`/admin/drafts/${draft._id}`} className="text-blue-600 underline">
  {draft.title || "Untitled Draft"}
</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
