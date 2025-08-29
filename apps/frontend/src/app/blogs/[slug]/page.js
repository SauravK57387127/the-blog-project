import BLogPageWrapper from "@/components/public/blog-detail/BlogPageWrapper";

export default function BlogDetailPage({ params }) {
    return (
        <main className="max-w-3xl mx-auto py-8">
            <h1>Loading blog: {params.slug}</h1>
            <p>Blog content, meta, actions, and comments will appear here.</p>
            {/* <BLogPageWrapper /> */}
        </main>
    );
}




// Once you're ready, you can replace it with BlogContent, BlogMeta, BlogActions, and CommentsSection.

// ### 📄 `/blogs/[slug]` — Blog Detail (BlogDetailPage)

// * Shows full blog content
// * Components:

//   * `BlogContent`
//   * `BlogMeta`
//   * `BlogActions` (like, bookmark, etc.)
//   * `CommentsSection`

// ===============================================================================

// ### ✅ Blog Detail Page Structure `/blogs/[slug]`

// ---

// #### 1. **Blog Content**

// * `BlogContent.jsx`
// * Renders blog title, cover image, tiptap HTML content

// ---

// #### 2. **Author Metadata**

// * `AuthorCard.jsx`
// * Shows author name, avatar, LinkedIn/Twitter
// * ✅ Sidebar (LeetCode-style) or above blog content

// ---

// #### 3. **Blog Actions**

// * `BlogActions.jsx`
// * Floating sidebar with:

//   * 👍 Like → `POST /api/blogs/:slug/like`
//   * 🔖 Bookmark → `POST /api/blogs/:slug/bookmark`
//   * 💬 Comment icon → scrolls to comment section

// ---

// #### 4. **Blog Tags Strip**

// * `BlogTagsBar.jsx`
// * Tags shown in a strip or badge list
// * Optional: clicking tag → navigate to homepage with `?tag=...`

// ---

// #### 5. **Comments Section**

// * `CommentsSection.jsx`
// * Visible only to authenticated users
// * Internals:

//   * `GET /api/blogs/:slug/comments`
//   * `POST /api/blogs/:slug/comment`

// ---

// #### 6. **Similar Blogs**

// * `SimilarBlogs.jsx`
// * Based on current blog's tags
// * Endpoint:

//   * `GET /api/blogs/:slug/similar`
// * Placement:

//   * Either after comments or right sidebar

// ---
