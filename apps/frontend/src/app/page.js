"use client";

import TiptapEditor from "@/components/admin/editor/Editor";
import PublicHomeWrapper from "@/components/public/home/PublicHomeWrapper";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <div className="w-full px-4 sm:px-6">
            <p className="text-3xl font-bold text-center text-blue-600 underline">
                Hello World
            </p>
            <PublicHomeWrapper />
        </div>
    );
}




// ### 🏠 `/` — Homepage (PublicHomePage)

// * Shows all blogs (paginated batch)
// * Handles:

//   * `?q=` → search term (live or submit)
//   * `?tag=` → filter by tag slug
// * Components:

//   * `SearchBar`
//   * `TagSidebar`
//   * `BlogList`
//   * `NoBlogsFound` (if needed)
