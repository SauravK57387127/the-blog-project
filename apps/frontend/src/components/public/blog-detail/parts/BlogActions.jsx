export default function BlogActions() {
    return (
        <div>This contains a sidebar for bookmark, like & comment icons.</div>
    );
}

// #### 3. **Blog Actions**

// * `BlogActions.jsx`
// * Floating sidebar with:

//   * 👍 Like → `POST /api/blogs/:slug/like`
//   * 🔖 Bookmark → `POST /api/blogs/:slug/bookmark`
//   * 💬 Comment icon → scrolls to comment section

// ### ✅ 3. `BlogActions.jsx`

// * 👍 Like:

//   * `POST /api/blogs/:slug/like`
//   * `BlogController.likeBlog(req, res)`
//   * `BlogService.likeBlog(userId, slug)`

// * 🔖 Bookmark:

//   * `POST /api/blogs/:slug/bookmark`
//   * `BlogController.bookmarkBlog(req, res)`
//   * `BlogService.bookmarkBlog(userId, slug)`
