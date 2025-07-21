import { asyncHandler } from '../../utils/asyncHandler.js';
// import CommentService from '../../services/user/comment.service.js';

export default {
  list: asyncHandler(async (req, res) => {
    res.json({ msg: 'list comments stub' });
  }),

  add: asyncHandler(async (req, res) => {
    res.json({ msg: 'add comment stub' });
  }),

  remove: asyncHandler(async (req, res) => {
    res.json({ msg: 'remove comment stub' });
  }),

  like: asyncHandler(async (req, res) => {
    res.json({ msg: 'like a comment stub' });
  }),

  // comment.controller.js
  update: asyncHandler(async (req, res) => {
    res.json({ msg: 'update comment stub' });
  }),
};



