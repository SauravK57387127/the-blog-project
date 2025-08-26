import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AdminBlogService from '../../services/admin/blog.service.js';

// ❌ 

export default {
    createDraft: asyncHandler( async (req, res) => {
        console.log("✅ create draft controller is reached!")
        console.log(`frontend data [req.body]: ${req.body}`)
        const result = await AdminBlogService.createDraft(req.body)
        if (!result.success) {
                      console.error("CONTROLLER: Draft creation failed 🟥");
    return sendResponse({res, statusCode: 400, success: false, message: "Draft creation failed", data: null,});
    }

  return sendResponse({ res, statusCode: 201, success: result.success, message: result.message, data: result.data });
}),

  listDrafts: asyncHandler(async (req, res) => {
  console.log("✅ list drafts controller reached!");
  const result = await AdminBlogService.listDrafts();

  return sendResponse({
    res,
    statusCode: result.success ? 200 : 400,
    success: result.success,
    message: result.message,
    data: result.data,
  });
}),

  blogAutoSave: asyncHandler(async (req, res) => {
  const result = await AdminBlogService.blogAutoSave(req.body);
    return sendResponse({ res, statusCode: result.success ? 201 : 400, success: result.success, message: result.message, data: result.data })
}),

// updateDraft: asyncHandler(async (req, res) => {
//   const result = await AdminBlogService.updateDraft(req.params.id, req.body);
//   sendResponse({ res, message: "Draft updated", data: result });
// }),


    getDraftById: asyncHandler(async (req, res) => {
  const result = await AdminBlogService.getDraftById(req.params.id);

  sendResponse({
    res,
statusCode: result.success ? 201 : 404,
    success: result.success, 
    message: result.message,
    data: result.success ? result.draft : null
  });
}),

    
  publishBlog: asyncHandler(async (req, res) => {
    const result = await AdminBlogService.publishNow(req.body);
  sendResponse({ res, statusCode: result.success ? 201 : 400, success: result.success, message: result.message, data: result.data });
  }),

  scheduleBlog: asyncHandler(async (req, res) => {
  const { success, message, data } = await AdminBlogService.scheduleBlog(req.body);
  sendResponse({ res, statusCode: 201, success, message, data });
}),
};
