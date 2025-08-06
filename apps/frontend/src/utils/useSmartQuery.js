"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher";

export function useSmartQuery(queryKey, endpoint, config = {}) {
    console.log(`🧠 useSmartQuery initialized → key:`, queryKey, `endpoint: ${endpoint}`);
    
    const shouldSkip = !endpoint || endpoint.includes('/null') || endpoint.includes('/undefined') || endpoint.endsWith('/');
    
    return useQuery({
        queryKey,
        queryFn: () => fetcher(endpoint),
        enabled: !shouldSkip && (config.enabled !== false),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        refetchOnWindowFocus: true,
        ...config,
    });
}
 
