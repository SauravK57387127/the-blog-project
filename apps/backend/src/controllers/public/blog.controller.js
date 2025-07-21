import { asyncHandler } from '../../utils/asyncHandler.js';
// import PublicBlogService from '../../services/public/blog.service.js';

export default {
  list: asyncHandler(async (_req, res) => {
    res.json({ msg: 'list public blogs stub' });
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    res.json({ msg: `show blog by slug (${slug}) stub` });
  }),

  popular: asyncHandler(async (req, res) => {
    res.json({ msg: `show blog by popularity stub` });
  }),

  recent: asyncHandler(async (req, res) => {
    res.json({ msg: `show recent blogs stub` });
  }),
};


