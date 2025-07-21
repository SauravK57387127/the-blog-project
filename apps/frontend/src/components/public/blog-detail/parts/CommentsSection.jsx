export default function CommentsSection() {
    return (
        <div>
            This is comment section. 
        </div>
    )
}










// #### 5. **Comments Section**

// * `CommentsSection.jsx`
// * Visible only to authenticated users
// * Internals:

//   * `GET /api/blogs/:slug/comments`
//   * `POST /api/blogs/:slug/comment`







// ### ✅ 5. `CommentsSection.jsx`

// * 📥 Fetch comments:

//   * `GET /api/blogs/:slug/comments`
//   * `CommentController.getBlogComments(req, res)`
//   * `CommentService.getAllComments(slug)`

// * 💬 Post comment:

//   * `POST /api/blogs/:slug/comment`
//   * `CommentController.addComment(req, res)`
//   * `CommentService.addComment(userId, slug, content)`





