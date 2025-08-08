import express from 'express';

import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import httpLogger from '../../../packages/logger/httpLogger.js';
import routes from './routes/index.js';

import { notFoundHandler } from './middlewares/notFoundHandler.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

import { sendResponse } from './utils/sendResponse.js';
import { asyncHandler } from './utils/asyncHandler.js';





export const createApp = () => {
    const app = express()

    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json());

    app.use(httpLogger);
    

    app.get(
        '/',
        asyncHandler(async (req, res) => {
            sendResponse({
            res,
            message: '🚀 Backend is alive and running on Railway!',
            });
        })
    );
    
    app.get(
        '/health',
        asyncHandler(async (req, res) => {
                sendResponse({
                    res,
                    message: 'Service is healthy',
                    data: { timestamp: new Date() },
                    });
                })
            );
            
    app.get(
        '/debug',
        asyncHandler( async (req, res) => {
            sendResponse({
                res, 
                message: "✅ Server reached DEBUG route",
                data: { timestamp: new Date() }
            })
        })
    )
                    
                    
    app.use('/api', routes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app
}

