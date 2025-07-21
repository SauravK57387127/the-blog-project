import { asyncHandler } from '../../utils/asyncHandler.js';
// import AdminBlogService from '../../services/admin/blog.service.js';

export default {
  list: asyncHandler(async (req, res) => {
    res.json({ msg: 'list blogs stub' });
  }),

  create: asyncHandler(async (req, res) => {
    res.json({ msg: 'create blog stub' });
  }),

  listDrafts: asyncHandler(async (req, res) => {
    res.json({ msg: 'list drafts stub' });
  }),

  updateDraft: asyncHandler(async (req, res) => {
    res.json({ msg: 'update draft stub' });
  }),

  deleteDraft: asyncHandler(async (req, res) => {
    res.json({ msg: 'delete draft stub' });
  }),

  update: asyncHandler(async (req, res) => {
    res.json({ msg: 'update blog stub' });
  }),

  remove: asyncHandler(async (req, res) => {
    res.json({ msg: 'remove blog stub' });
  }),

  publishNow: asyncHandler(async (req, res) => {
    res.json({ msg: 'publish now stub' });
  }),

  schedulePublish: asyncHandler(async (req, res) => {
    res.json({ msg: 'schedule publish stub' });
  }),
};
