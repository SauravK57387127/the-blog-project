"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useSmartQuery(queryKey, endpoint, config = {}) {
    // console.log(`🧠 useSmartQuery initialized → key:`, queryKey, `endpoint: ${endpoint}`);
    
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


export function useSmartMutation(endpoint, method = "POST", options = {}) {
    const queryClient = useQueryClient();
 
    return useMutation({
        mutationFn: async (data) => {
            console.log(`🛠️ useSmartMutation: ${method} → ${endpoint}`);
            return await fetcher(endpoint, {
                method,
                body: JSON.stringify(data),
            });
        },
        onSuccess: (data, variables, context) => {
                  options.onSuccess?.(data, variables, context);

            if (options.invalidateKeys) {
                const keys = Array.isArray(options.invalidateKeys) ? options.invalidateKeys : [options.invalidateKeys];
                keys.forEach((key) => {
      queryClient.invalidateQueries(key);
      console.log(`♻️ Invalidated query key: ${key}`);
    });
            }

        },
        onError: (error, variables, context) => {
            console.error(`🚨 Mutation failed: ${error.message}`);
            options.onError?.(error, variables, context);
        },
        
        ...options,
    });
} 