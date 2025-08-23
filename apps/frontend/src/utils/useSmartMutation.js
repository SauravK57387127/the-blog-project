"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "./fetcher";

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
            if (!options.invalidateKeys) return;

            const keys = Array.isArray(options.invalidateKeys) ? options.invalidateKeys : [options.invalidateKeys];
            keys.forEach((key) => {
  queryClient.invalidateQueries(key);
  console.log(`♻️ Invalidated query key: ${key}`);
});

            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            console.error(`🚨 Mutation failed: ${error.message}`);
            options.onError?.(error, variables, context);
        },
        ...options,
    });
} 

