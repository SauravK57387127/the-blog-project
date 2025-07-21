import { logger } from '../../../../packages/logger/index.js';


export function errorHander(err, req, res, next) {
    logger.error(err.stack || err.message);

    res.status(err.status || 500).json({
        status: "error",
        message: err.message || 'Internal Server Error',
    })
}


