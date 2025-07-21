import { asyncHandler } from '../../utils/asyncHandler.js';
// import TagService from '../../services/public/tag.service.js';

export default {
  blogsByTag: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    res.json({ msg: `show tag by slug (${slug}) stub` });
  }),
};


