import { useAllBlogs } from "@/hooks/public/useAllBlogs";

export default function BlogList() {
    const { data: blogs, isLoading } = useAllBlogs({ staletime: 0 });
    if (isLoading) return <div>Loading blogs...</div>;

    return (
        <div>
            {blogs.map((blog) => (
                <div key={blog._id}>
                    <h2>{blog.title}</h2>
                    <p>{blog.excerpt}</p>
                </div>
            ))}
        </div>
    );
}

// ### 1. Backend endpoints (sufficient for your scope):

// ```http
// GET /api/blogs?limit=10&offset=0          // base batch fetch
// GET /api/blogs/search?q=term              // search by text
// GET /api/blogs/tag/:slug?limit=10         // fetch blogs by tag
// ```
