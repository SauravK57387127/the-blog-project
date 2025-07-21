import { asyncHandler } from '../../utils/asyncHandler.js';
// import LikeService from '../../services/user/like.service.js';

export default {
  // ── Blog likes count/list ──
  listBlog: asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    // const likes = await LikeService.listBlog(blogId);
    res.json({ msg: `likes for blog ${blogId} stub` });
  }),

  // ── Comment likes count/list ──
  listComment: asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    // const likes = await LikeService.listComment(commentId);
    res.json({ msg: `likes for comment ${commentId} stub` });
  }),

  // ── Add like ──
  add: asyncHandler(async (req, res) => {
    res.json({ msg: 'add like stub' });
  }),

  // ── Remove like ──
  remove: asyncHandler(async (req, res) => {
    res.json({ msg: 'remove like stub' });
  }),
};



