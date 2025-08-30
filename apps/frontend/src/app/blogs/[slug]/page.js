'use client'

import BLogPageWrapper from "@/components/public/blog-detail/BlogPageWrapper";
import { useGetBlogBySlug } from "@/services/public/useBlogsService";
import DOMPurify from 'dompurify'


export default function BlogDetailPage({ params }) {
      const { data: res, isLoading, error } = useGetBlogBySlug(params.slug);
      const blog = res?.data;

  if (isLoading) return <div className="p-4">Loading blog...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading blog</div>;
  if (!blog) return <div className="p-4">Blog not found</div>;

    return (
        <main className="max-w-3xl mx-auto py-8">
            {/* <h1>Loading blog: {params.slug}</h1>
            <p>Blog content, meta, actions, and comments will appear here.</p> */}
            {/* <BLogPageWrapper /> */}

            <article className="prose lg:prose-xl">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

        {blog?.coverImage && (
  <img src={blog.coverImage} alt={blog.title || "Blog image"} className="w-full h-auto rounded mb-6" />
)}
{blog?.publishedAt && (
  <p className="text-sm text-gray-500 mb-2">
    Published: {new Date(blog.publishedAt).toLocaleString()}
  </p>
)}
{blog?.scheduleAt && (
  <p className="text-sm text-gray-500 mb-4">
    Scheduled: {new Date(blog.scheduleAt).toLocaleString()}
  </p>
)}

{blog?.content ? (
  <div className="prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
) : (
  <p className="text-gray-400 italic">No content available</p>
)}
       {blog?.tags?.length > 0 && (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">Tags:</h3>
    <div className="flex flex-wrap gap-2">
      {blog.tags.map((tag) => (
        <span
          key={tag}
          className="bg-gray-200 text-sm px-2 py-1 rounded"
        >
          #{tag}
        </span>
      ))}
    </div>
  </div>
)}
      </article>
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
