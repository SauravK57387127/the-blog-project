export default function BlogRowActions() {
    return (
        <div>
Purpose: Action buttons for each blog (edit, delete, view)
        </div>
    )
}





// ### ✅ 2. `BlogRowActions.jsx`

// **Purpose:** Action buttons for each blog (edit, delete, view)

// **🔗 Endpoints:**

// * `DELETE /api/admin/blogs/:id`
// * `GET /api/admin/blogs/:id` *(for edit/view page prefill)*

// **🧠 Controller:**

// ```js
// BlogController.deleteBlog(req, res)
// BlogController.getSingleBlog(req, res)
// ```

// **🔧 Service:**

// ```js
// BlogService.deleteById(id)
// BlogService.getById(id)
// ```