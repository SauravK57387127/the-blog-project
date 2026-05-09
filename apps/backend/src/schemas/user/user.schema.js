import { z } from 'zod';

export const addCommentSchema = z.object({
    text: z
        .string()
        .min(1, 'Comment cannot be empty')
        .max(500, 'Comment must be under 500 characters'),
});
