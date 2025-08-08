import { asyncHandler } from "../../utils/asyncHandler.js";


export default {
  getAllBlogs: asyncHandler( async () => {
    return await Blog.find({ status: 'published' }).sort({ publishedAt: -1 });
  }),

  popular: async () => { /* TODO */ },
  recent: async () => { /* TODO */ },
  getBySlug: async (slug) => { /* TODO */ },
};
