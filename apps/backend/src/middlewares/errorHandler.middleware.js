import { logger } from '../../../../packages/logger/index.js';
import { sendResponse } from '../utils/sendResponse.js';

export function errorHandler(err, req, res, next) {
    logger.error(err.stack || err.message);

  sendResponse({
    res,
    statusCode: err.statusCode || 500,
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.stack // Keeping stack for now, no production filter
  });
}


// export function errorHander(err, req, res, next) {

//     res.status(err.status || 500).json({
//         status: "error",
//         message: err.message || 'Internal Server Error',
//     })
// }


