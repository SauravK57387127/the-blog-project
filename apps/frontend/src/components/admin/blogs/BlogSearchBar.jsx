export default function BlogSearchBar() {
    return <div>Purpose: Search/filter blogs by title/tags/status</div>;
}

// ### ✅ 3. `BlogSearchBar.jsx` *(optional)*

// **Purpose:** Search/filter blogs by title/tags/status

// **🔗 Endpoint:**

// ```http
// GET /api/admin/blogs/search?q=xyz&tag=abc
// ```

// **🧠 Controller:**

// ```js
// BlogController.searchBlogs(req, res)
// ```

// **🔧 Service:**

// ```js
// BlogService.search({ q, tag })
// ```
