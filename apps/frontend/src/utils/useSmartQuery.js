"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher.js";


export function useSmartQuery(queryKey, endpoint, config = {}) {
    console.log(`🧠 useSmartQuery initialized → key:`, queryKey, `endpoint: ${endpoint}`);
    
    // Enhanced validation for skipping queries
    const shouldSkip = !endpoint || 
                       endpoint.includes('/null') || 
                       endpoint.includes('/undefined') || 
                       endpoint.endsWith('/') ||
                       queryKey.some(key => key === null || key === undefined || key === 'null' || key === 'undefined');
     
    if (shouldSkip) {
        console.log(`⏭️ Skipping query due to invalid endpoint or key:`, { queryKey, endpoint });
    }

    return useQuery({
        queryKey,
        queryFn: () => fetcher(endpoint),
        enabled: !shouldSkip && (config.enabled !== false),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000, // Updated from deprecated cacheTime
        refetchOnWindowFocus: true,
        retry: (failureCount, error) => {
            // Don't retry on 404s or other client errors
            if (error?.message?.includes('404') || error?.message?.includes('405')) {
                return false;
            }
            return failureCount < 3;
        },
        ...config,
    });
}


