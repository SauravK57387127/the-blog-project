export default function AdminEditBlogPage() {
    return(
    <div>
      handles — the edit/view blog page.
    </div>
  ); 
}





// Here’s what it will do:

// * Prefill the Tiptap editor with blog data
// * Allow editing title, tags, content
// * Show a **Save/Update** button




// Exactly ✅ — this is a **page**, not just a component.

// * You’ll **navigate to `/admin/blogs/[slug]`** by clicking “Edit” from `/admin/blogs`.
// * The logic (fetching blog data, rendering the editor, handling updates) happens inside `page.js` of `[slug]`.

// And yes — you still need to export the main function:

// ```js
// export default function AdminEditBlogPage() {
//   return <div>...</div>;
// }
// ```

// This makes it a proper route handler for that dynamic slug.





// ### ✅ What it needs

// **🔗 Endpoint:**

// ```http
// GET /api/admin/blogs/:slug   // to fetch blog
// PUT /api/admin/blogs/:slug   // to update blog
// ```

// **🧠 Controller:**

// ```js
// BlogController.getSingleBlog
// BlogController.updateBlog
// ```

// **🔧 Service:**

// ```js
// BlogService.getBySlug
// BlogService.updateBySlug
// ```


