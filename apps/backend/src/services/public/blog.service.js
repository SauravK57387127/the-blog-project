import { asyncHandler } from "../../utils/asyncHandler.js";
import Blog from "../../../../../database/models/blog.model.js";


export default {
    getAllBlogs: async () => {  // Remove asyncHandler here
  if (!Blog || typeof Blog.find !== 'function') {
    return [];
  }

  try {
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .lean();
    
    return blogs;
  } catch (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
},

  popular: async () => { /* TODO */ },
  recent: async () => { /* TODO */ },
  getBySlug: async (slug) => { /* TODO */ },
};
