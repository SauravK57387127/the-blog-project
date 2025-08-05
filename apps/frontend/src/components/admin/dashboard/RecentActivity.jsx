export default function RecentActivity() {
    return <div>Recent blog activity (latest published, updated)</div>;
}

// ### ✅ 1. `RecentActivity.jsx`

// **Purpose:** Show 5 latest blogs (by createdAt or updatedAt)

// **🔗 Endpoint needed:**

// ```http
// GET /api/admin/blogs/recent?limit=5
// ```

// **🧠 Controller:**

// ```js
// BlogController.getRecentBlogs(req, res)
// ```

// **🔧 Service:**

// ```js
// BlogService.getRecentBlogs(limit)
// ```
