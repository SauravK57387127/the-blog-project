import { asyncHandler } from '../../utils/asyncHandler.js';
// import AnalyticsService from '../../services/admin/analytics.service.js';

export default {
  overview: asyncHandler(async (req, res) => {
    // const data = await AnalyticsService.getOverview();
    res.json({ msg: 'analytics overview stub' });
  }),

  blogStats: asyncHandler(async (req, res) => {
    const { id } = req.params;
    // const data = await AnalyticsService.getBlogStats(id);
    res.json({ msg: `blog stats stub for ${id}` });
  }),
};
