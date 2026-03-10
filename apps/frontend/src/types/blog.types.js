/**
 * Blog Type Definitions
 * 
 * Type structure for blog posts across the application.
 * Ready for React Query integration.
 */

/**
 * @typedef {Object} Blog
 * @property {string} _id - Unique identifier
 * @property {string} slug - URL-friendly identifier
 * @property {string} title - Blog post title
 * @property {string} content - Full blog content (markdown or HTML)
 * @property {string} [excerpt] - Short description (optional, fallback to content substring)
 * @property {string} [coverImage] - Cover image URL (optional)
 * @property {string[]} tags - Array of tag strings
 * @property {string} publishedAt - ISO date string
 * @property {number} readingTime - Estimated reading time in minutes
 * @property {number} [views] - View count (optional, for popular posts)
 * @property {boolean} [featured] - Whether post is featured (optional)
 */

/**
 * @typedef {Object} BlogCardProps
 * @property {Blog} blog - Blog data object
 * @property {(slug: string) => void} onClick - Click handler
 * @property {number} [index] - Optional index for ranking/numbering
 * @property {boolean} [compact] - Whether to use compact layout
 */

/**
 * @typedef {Object} BlogSectionProps
 * @property {Blog[]} blogs - Array of blog posts
 * @property {(slug: string) => void} onBlogClick - Blog click handler
 * @property {boolean} [isLoading] - Loading state
 */

// Export empty object to make this a module
export {};
