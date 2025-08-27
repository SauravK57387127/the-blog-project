import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import PublicBlogService from '../../services/public/blog.service.js'


export default {
  getAllBlogs: asyncHandler(async (req, res) => { 
    console.log('✅ all_blogs controller reached!');

    const result = await PublicBlogService.getAllBlogs();

    // Add this safety check
//   if (!blogs || !Array.isArray(blogs)) {
//     return sendResponse({
//       res,
//       statusCode: 500,
//       success: false,
//       message: 'Service error - invalid response',
//       data: []
//     });
//   }

//     if (blogs.length === 0) {
//       return sendResponse({
//         res,
//         message: 'No blogs found',
//         data: []
//       });
//     }

//     console.log('all_blogs fetched !!');
    return sendResponse({
      res,
      statusCode: result.success ? 201 : 400,
      success: result.success,
      message: result.message,
      data: result.data
    });
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    sendResponse({res, message: `show blog by slug (${slug}) stub` });
  }),

  popular: asyncHandler(async (req, res) => {
    sendResponse({res, message: `show blog by popularity stub` });
  }),

  recent: asyncHandler(async (req, res) => {
    sendResponse({res, message: `show recent blogs stub` });
  }),
};


