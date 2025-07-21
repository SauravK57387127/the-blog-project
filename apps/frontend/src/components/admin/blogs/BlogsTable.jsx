export default function BlogsTable() {
    return (
        <div>
            Purpose: Show all blogs in table form
        </div>
    )
}






// ### ✅ 1. `BlogsTable.jsx`

// **Purpose:** Show all blogs in table form

// **🔗 Endpoint:**

// ```http
// GET /api/admin/blogs?sort=desc&page=1&limit=10
// ```

// **🧠 Controller:**

// ```js
// BlogController.getAllBlogs(req, res)
// ```

// **🔧 Service:**

// ```js
// BlogService.getAll({ page, limit, sort })
// ```

