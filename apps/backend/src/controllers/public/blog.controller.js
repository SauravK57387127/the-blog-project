import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import PublicBlogService from '../../services/public/blog.service.js'


export default {
  getAllBlogs: asyncHandler(async (req, res) => { 
    console.log("all_blogs controller reached !")                            
    const result = await PublicBlogService.getAllBlogs();
    console.log("all_blogs fetched !!")
  sendResponse({ res, message: 'All published blogs fetched', data: result });
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


