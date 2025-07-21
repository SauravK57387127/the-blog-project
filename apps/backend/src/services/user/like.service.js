// Like toggles & counts for blogs and comments
export default {
  // Blog
  listBlog: async (blogId) => { /* TODO */ },
  add: async (userId, target) => { /* TODO */ },       // target = { blogId } or { commentId }
  remove: async (userId, target) => { /* TODO */ },    // same shape
  // Comment like counts
  listComment: async (commentId) => { /* TODO */ },
};
