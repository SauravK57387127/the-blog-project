import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';


export default {
  list: asyncHandler(async (_req, res) => {                             
    sendResponse({ res, message: 'List of blogs (dummy response)' });
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    sendResponse({res, message: `show blog by slug (${slug}) stub` });
  }),

  popular: asyncHandler(async (req, res) => {
    sendResponse({res, message: `show blog by popularity stub` });
  }),

  recent: asyncHandler(async (req, res) => {
    sendResponse({res, message: `show recent blogs stub` });
  }),
};


