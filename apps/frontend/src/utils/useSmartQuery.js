"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher.js";


export function useSmartQuery(queryKey, endpoint, config = {}) {
    console.log(`🧠 useSmartQuery initialized → key:`, queryKey, `endpoint: ${endpoint}`);
    
    const invalidKey = queryKey.some(
        key => key == null || key === 'null' || key === 'undefined'
    );
    const shouldSkip = !endpoint || invalidKey || endpoint.includes('/null') || endpoint.includes('/undefined') || endpoint.endsWith('/');

    if (shouldSkip) {
        console.log(`⏭️ Skipping query due to invalid endpoint or key:`, { queryKey, endpoint });
    }

    return useQuery({
        queryKey,
        queryFn: () => fetcher(endpoint),
        enabled: !shouldSkip && config.enabled !== false,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: (failureCount, error) => {
            if (error?.message?.includes('404') || error?.message?.includes('405')) return false;
            return failureCount < 2; // retry only once after the first failure
        },
        ...config,
    });
}



