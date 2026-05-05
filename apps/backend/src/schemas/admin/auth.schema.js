import { z } from 'zod';

/**
 * Login Request Schema
 *
 * Validates:
 * - Username: 3-30 characters, alphanumeric + underscore
 * - Password: 8-100 characters (we check hash, but validate length)
 */
export const loginSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores',
        ),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters'),
});

/**
 * Refresh Token Schema
 *
 * Note: Refresh token comes from httpOnly cookie, not body
 * This schema is for explicit refresh requests (if needed)
 */
export const refreshSchema = z.object({
    refreshToken: z.string().optional(), // Optional because it might come from cookie
});

/**
 * Create Admin Schema (for seeding/setup)
 *
 * Used by super admin to create new admin accounts
 */
export const createAdminSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores',
        ),

    password: z
        .string()
        .min(12, 'Admin password must be at least 12 characters') // Stricter for admin!
        .max(100, 'Password must not exceed 100 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Password must contain uppercase, lowercase, number, and special character',
        ),

    role: z.enum(['admin', 'super_admin']).default('admin'),
});

/**
 * Update Admin Schema
 *
 * For updating admin account details
 */
export const updateAdminSchema = z
    .object({
        username: z
            .string()
            .min(3)
            .max(30)
            .regex(/^[a-zA-Z0-9_]+$/)
            .optional(),

        role: z.enum(['admin', 'super_admin']).optional(),

        // If changing password
        currentPassword: z.string().optional(),

        newPassword: z
            .string()
            .min(12)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
            .optional(),
    })
    .refine(
        (data) => {
            // If newPassword provided, currentPassword must also be provided
            if (data.newPassword && !data.currentPassword) {
                return false;
            }
            return true;
        },
        {
            message: 'Current password required when changing password',
            path: ['currentPassword'],
        },
    );
