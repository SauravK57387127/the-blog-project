import Blog from "../../../../../database/models/blog.model.js";


export default {
    getAllBlogs: async () => {  // Remove asyncHandler here
    console.log('all_blogs services reached! ✅');
//   if (!Blog || typeof Blog.find !== 'function') {
//     return [];
//   }

//   try {
    // const blogs = await Blog.find({ status: 'published' })
    //   .sort({ publishedAt: -1 })
    //   .lean();
    
//     return blogs;
//   } catch (error) {
//     throw new Error(`Failed to fetch blogs: ${error.message}`);
//   }

const blogs = await Blog.find({ status: "published" }).sort({ publishedAt: -1 });
return {
  success: blogs.length > 0,
  message: blogs.length > 0 ? 'Fetched blogs! ✅' : 'No blogs found ❌',
  data: blogs,
};
},

  popular: async () => { /* TODO */ },
  recent: async () => { /* TODO */ },
  getBySlug: async (slug) => { /* TODO */ },
};
