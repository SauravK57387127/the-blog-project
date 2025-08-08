import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AdminBlogService from '../../services/admin/blog.service.js';


export default {
  listDrafts: asyncHandler(async (req, res) => {
  const result = await AdminBlogService.listDrafts();
  sendResponse({ res, message: "All drafts", data: result });
}),

  blogAutoSave: asyncHandler(async (req, res) => {
  const result = await AdminBlogService.blogAutoSave(req.body);
  sendResponse({ res, message: "Draft saved", data: result });
}),

  updateDraft: asyncHandler(async (req, res) => {
  const result = await AdminBlogService.updateDraft(req.params.id, req.body);
  sendResponse({ res, message: "Draft updated", data: result });
}),

    getDraftById: asyncHandler(async (req, res) => {
  const result = await AdminBlogService.getDraftById(req.params.id);

  sendResponse({
    res,
    message: result.message,
    data: result.found ? result.draft : null
  });
}),

    
  publishBlog: asyncHandler(async (req, res) => {
    const result = await AdminBlogService.publishNow(req.body);
    sendResponse({ res, message: "Blog published", data: result });
  }),

  scheduleBlog: asyncHandler(async (req, res) => {
    const { blog, scheduled } = await AdminBlogService.scheduleBlog(req.body);
    const message = scheduled ? "Blog scheduled" : "Published immediately";
    sendResponse({ res, message, data: blog });
  }),
};
