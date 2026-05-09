import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import ViewTrackingService from '../../services/public/viewTracking.service.js';

export default {
    trackViewBySlug: asyncHandler(async (req, res) => {
        const { slug } = req.params;
        const { userId, referrer, device } = req.body || {};

        // Build sessionId for dedup — scoped to today for "1 view per day" behaviour
        const today = new Date().toISOString().slice(0, 10); // "2026-03-12"
        const ip =
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.ip ||
            'unknown';
        const ua = req.headers['user-agent'] || 'unknown';

        const sessionId = userId
            ? `user_${userId}_${today}` // logged-in: 1/day
            : `anon_${Buffer.from(ip + ua)
                  .toString('base64')
                  .slice(0, 24)}_${today}`; // anon: 1/day

        const result = await ViewTrackingService.trackViewBySlug({
            slug,
            sessionId,
            userId: userId || null,
            referrer: referrer || null,
            device: device || 'unknown',
        });

        sendResponse({
            res,
            statusCode: result.success ? 200 : 404,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * POST /api/public/views/track
     */
    trackView: asyncHandler(async (req, res) => {
        const { blogId, sessionId, userId, referrer, device } = req.body;

        if (!blogId || !sessionId) {
            return sendResponse({
                res,
                statusCode: 400,
                success: false,
                message: 'blogId and sessionId required',
                data: null,
            });
        }

        const result = await ViewTrackingService.trackView({
            blogId,
            sessionId,
            userId,
            referrer,
            device,
        });

        sendResponse({
            res,
            statusCode: result.success ? 201 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),

    /**
     * POST /api/public/views/update
     */
    updateView: asyncHandler(async (req, res) => {
        const { blogId, sessionId, timeSpent, scrollDepth, completed } =
            req.body;

        if (!blogId || !sessionId) {
            return sendResponse({
                res,
                statusCode: 400,
                success: false,
                message: 'blogId and sessionId required',
                data: null,
            });
        }

        const result = await ViewTrackingService.updateView({
            blogId,
            sessionId,
            timeSpent,
            scrollDepth,
            completed,
        });

        sendResponse({
            res,
            statusCode: result.success ? 200 : 400,
            success: result.success,
            message: result.message,
            data: result.data,
        });
    }),
};
