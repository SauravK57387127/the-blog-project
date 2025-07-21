import { asyncHandler } from '../../utils/asyncHandler.js';
// import MetadataService from '../../services/admin/metadata.service.js';

export default {
  get: asyncHandler(async (_req, res) => {
    // const data = await MetadataService.get();
    res.json({ msg: 'get metadata stub' });
  }),

  update: asyncHandler(async (req, res) => {
    // const data = await MetadataService.update(req.body);
    res.json({ msg: 'update metadata stub' });
  }),
};
