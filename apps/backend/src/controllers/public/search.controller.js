import { asyncHandler } from '../../utils/asyncHandler.js';
// import SearchService from '../../services/public/search.service.js';

export default {
  searchBlogs: asyncHandler(async (req, res) => {
    const { q } = req.query;
    res.json({ msg: `search query for "${q}" stub` });
  }),
};


