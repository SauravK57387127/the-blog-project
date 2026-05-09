import '../instrument.js';
import express from 'express';

import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import * as Sentry from '@sentry/node';

import httpLogger from '../../../packages/logger/httpLogger.js';
import { config } from '@theblogproj/config';

import { routerFactory as routes } from './routes/index.js';

import { notFoundHandler } from './middlewares/notFoundHandler.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

import { sendResponse } from './utils/sendResponse.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { setupBullBoard } from '../infra/bullboard.js';
import { clerkMiddleware } from '@clerk/express';

console.log('🟦 App.js loading...');

export const createApp = ({ blogQueue, deadLetterQueue } = {}) => {
    console.log('🟦 Creating app...');

    const app = express();
    console.log('🟦 Express initialized');

    app.use(helmet());
    //   app.use(cors({ origin: true, credentials: true })); // 👈 include credentials for cookies

    app.use(
        cors({
            origin: (origin, callback) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
},            credentials: true, // Allow credentials
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-test-user-id'],
        }),
    );

    // ===== CLERK WEBHOOK (needs raw body) =====
    app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }));

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(compression());
    app.use(cookieParser());

    // mongo-sanitize
    // app.use(mongoSanitize({ replaceWith: '_', allowDots: true }));

    if (config.nodeEnv !== 'test') {
        // app.use(httpLogger);
    }

    // Health-check routes
    app.get(
        '/',
        asyncHandler(async (req, res) => {
            sendResponse({ res, message: '🚀 Backend is alive and running!' });
        }),
    );

    app.get(
        '/health',
        asyncHandler(async (req, res) => {
            //   const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
            sendResponse({
                res,
                message: 'Service is healthy',
                data: { timestamp: new Date() },
            });
        }),
    );

    app.use(clerkMiddleware());

    app.use((req, res, next) => {
        console.log('🔴 After Clerk:', req.path);
        next();
    });

    // API routes
    console.log('Before mounting /api');
    app.use('/api', routes({ blogQueue }));

    Sentry.setupExpressErrorHandler(app);

    // Bullboard monitoring
    if (blogQueue) {
        setupBullBoard(app, { blogQueue, deadLetterQueue });
    }

    app.use(errorHandler);

    return app;
};
