"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher";

export function useSmartQuery(queryKey, endpoint, config = {}) {
    if (endpoint.includes('/null') || endpoint.includes('/undefined')) {
        return { data: null, isLoading: false, error: null };
    }
    
    console.log(`🧠 useSmartQuery initialized → key:`, queryKey);

    return useQuery({
        queryKey,
        queryFn: () => fetcher(endpoint),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        refetchOnWindowFocus: true,
        ...config,
    });
}
 