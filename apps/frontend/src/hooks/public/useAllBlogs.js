"use client";

import { useSmartQuery } from "@/utils/useSmartQuery";

export function useAllBlogs(config) {
    return useSmartQuery(["allBlogs"], "/public/blogs", config);
}





// Example - inside component

// const { data } = useAllBlogs({ staleTime: 0 });

// Fetch all public blogs to display on homepage or blog listing page.
