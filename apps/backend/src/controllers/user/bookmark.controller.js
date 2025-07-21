import { asyncHandler } from '../../utils/asyncHandler.js';
// import BookmarkService from '../../services/user/bookmark.service.js';

export default {
  list: asyncHandler(async (req, res) => {
    res.json({ msg: 'list bookmarks stub' });
  }),

  add: asyncHandler(async (req, res) => {
    res.json({ msg: 'add bookmark stub' });
  }),

  remove: asyncHandler(async (req, res) => {
    res.json({ msg: 'remove bookmark stub' });
  }),
};
