import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import EditorsChoiceService from '../../services/admin/editorsChoice.service.js';

export default {
  getCurrentPicks: asyncHandler(async (req, res) => {
    const result = await EditorsChoiceService.getCurrentPicks();

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  addPick: asyncHandler(async (req, res) => {
    const { blogId, annotation, pickOrder } = req.body;

    if (!blogId || !annotation || !pickOrder) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'blogId, annotation, and pickOrder required',
        data: null,
      });
    }

    const result = await EditorsChoiceService.addPick({
      blogId,
      annotation,
      pickOrder,
    });

    sendResponse({
      res,
      statusCode: result.success ? 201 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  updatePick: asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const updates = req.body;

    const result = await EditorsChoiceService.updatePick(blogId, updates);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  removePick: asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    const result = await EditorsChoiceService.removePick(blogId);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  reorderPicks: asyncHandler(async (req, res) => {
    const { blogIds } = req.body;

    if (!blogIds || !Array.isArray(blogIds) || blogIds.length !== 4) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'blogIds array with exactly 4 IDs required',
        data: null,
      });
    }

    const result = await EditorsChoiceService.reorderPicks(blogIds);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
