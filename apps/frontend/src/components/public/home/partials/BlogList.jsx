// import { useAllBlogs } from "@/hooks/public/useAllBlogs";

import { useAllBlogs } from "@/services/public/useBlogsService";
import { useRouter } from "next/navigation";


export default function BlogList() {
    // This query runs twice because: check react_notes
    const router = useRouter()

    const { data: res, isLoading, error } = useAllBlogs();
    const blogs = res?.data

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading blogs</div>;
    if (!blogs?.length) return <div>No blogs published yet</div>;

    return (
        <div>
            {blogs.map((blog) => (
                // <div key={blog._id}>
                //     <h2>{blog.title}</h2>
                // </div>
                <div
  key={blog._id}
  onClick={() => router.push(`/blogs/${blog.slug}`)}
  className="border p-4 rounded cursor-pointer hover:shadow"
>
  <h2 className="text-lg font-semibold">{blog.title}</h2>
  {/* <div className="prose max-w-none mt-2">{blog.content}</div> */}

<div className="mt-2 text-sm text-gray-700">
  <strong>Tags:</strong> {blog.tags?.join(", ")}
</div>

<div className="mt-1 text-xs text-gray-500">
  <p>Published: {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "—"}</p>
  <p>Scheduled: {blog.scheduleAt ? new Date(blog.scheduleAt).toLocaleDateString() : "—"}</p>
</div>

</div>
            ))}
        </div>
//         <div
//   key={blog._id}
//   onClick={() => router.push(`/blogs/${blog.slug}`)}
//   className="border p-4 rounded cursor-pointer hover:shadow"
// >
//   <h2 className="text-lg font-semibold">{blog.title}</h2>
// </div>

    );
}




// ### 1. Backend endpoints (sufficient for your scope):

// ```http
// GET /api/blogs?limit=10&offset=0          // base batch fetch
// GET /api/blogs/search?q=term              // search by text
// GET /api/blogs/tag/:slug?limit=10         // fetch blogs by tag
// ```
