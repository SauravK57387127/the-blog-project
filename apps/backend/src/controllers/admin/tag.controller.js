import { asyncHandler } from '../../utils/asyncHandler.js';
// import TagService from '../../services/admin/tag.service.js';

export default {
    list: asyncHandler(async (_req, res) => {
        res.json({ msg: 'list tags stub' });
    }),

    create: asyncHandler(async (req, res) => {
        res.json({ msg: 'create tag stub' });
    }),

    remove: asyncHandler(async (req, res) => {
        res.json({ msg: 'remove tag stub' });
    }),
};
