export default function TopBlogs() {
    return (
        <div>
            <p>Top blogs by views – today, week, month</p>
        </div>
    );
}

// ### ✅ 3. `TopBlogs.jsx`

// **Purpose:** Show most-viewed blogs for:

// * Today
// * This week
// * This month

// **🔗 Endpoint needed:**

// ```http
// GET /api/admin/blogs/top?range=today|week|month
// ```

// **🧠 Controller:**

// ```js
// AnalyticsController.getTopBlogsByRange(req, res)
// ```

// **🔧 Service:**

// ```js
// AnalyticsService.getTopBlogs(range)
// ```
