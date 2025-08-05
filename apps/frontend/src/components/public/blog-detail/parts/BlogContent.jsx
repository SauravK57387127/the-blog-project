export default function BlogContent() {
    return <div>This contains the actual blog content.</div>;
}

// ### ✅ 1. `BlogContent.jsx`

// * 🔗 `GET /api/blogs/:slug`
// * 🧠 `BlogController.getSingleBlog(req, res)`
// * 🔧 `BlogService.getSingleBlogBySlug(slug)`

// ===========================================================================================================

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
