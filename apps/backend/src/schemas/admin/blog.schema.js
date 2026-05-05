import { z } from 'zod';

// 1. Draft creation
export const createDraftSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    tags: z.array(z.string()).optional(),
});

// 2. Draft auto-save (can update existing draft or create new one)
export const blogAutoSaveSchema = z.object({
    _id: z.string().optional(), // present when updating
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    tags: z.array(z.string()).optional(),
});

// 3. Get draft by ID (params, not body)
export const getDraftByIdSchema = z.object({
    id: z.string().min(1, 'Draft ID is required'),
});

// 4. Publish blog
export const publishBlogSchema = z.object({
    _id: z.string().optional(), // if draft exists, delete it
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
});

// 5. Schedule blog
export const scheduleBlogSchema = z.object({
    _id: z.string().min(1, 'Draft ID is required'),
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    scheduledAt: z.coerce.date({ required_error: 'scheduledAt is required' }),
});
