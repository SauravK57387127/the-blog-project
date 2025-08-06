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
 

git commit -m "fix: move conditional logic from hook call to enabled option

- Replace early return with enabled flag in useSmartQuery
- Ensure React hooks are called unconditionally
- Fix Vercel build ESLint error

REASON: React hooks must always be called in the same order - I can't conditionally skip calling them or return early before them. The solution moves the condition inside the hook's enabled option instead" 