import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from './fetcher';

export function useSmartMutation(endpoint, method = 'POST', options = {}) {
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
      console.log(`✅ Mutation success`);
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach(key => {
          queryClient.invalidateQueries(key);
          console.log(`♻️ Invalidated query:`, key);
        });
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error(`🚨 Mutation failed: ${error.message}`);
      options.onError?.(error, variables, context);
    },
    ...options,
  });
}



// Example ->

// const createComment = useSmartMutation('/api/comments', 'POST', {
//   invalidateKeys: [['comments', blogId]],
//   onSuccess: () => console.log('Comment created'),
// });

