// export function notFoundHandler(req, res, next) {
//     res.status(404).json({
//         status: "error",
//         message: `Route ${req.originalUrl} not found`,
//     })
// } 


import { sendResponse } from '../utils/sendResponse.js';

export function notFoundHandler(req, res, next) {
  sendResponse({
    res,
    statusCode: 404,
    success: false,
    message: `Route ${req.originalUrl} [${req.method}] not found`,
    data: null,
    meta: {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl
    }
  });
}
