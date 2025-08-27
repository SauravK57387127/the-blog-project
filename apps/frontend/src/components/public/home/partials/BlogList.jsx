import { useAllBlogs } from "@/hooks/public/useAllBlogs";

export default function BlogList() {
    // This query runs twice because: check react_notes
    const { data: res, isLoading, error } = useAllBlogs();
    const blogs = res?.data

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading blogs</div>;
    if (!blogs?.length) return <div>No blogs published yet</div>;

    return (
        <div>
            {blogs.map((blog) => (
                <div key={blog._id}>
                    <h2>{blog.title}</h2>
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
