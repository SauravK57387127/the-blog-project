import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import httpLogger from '../../../packages/logger/httpLogger.js';
import routes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.middleware.js';
import { errorHander } from './middlewares/errorHandler.middleware.js';


export const createApp = () => {
    const app = express()

    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json());

    app.use(httpLogger);

    app.use('/api', routes);
    
    app.use(notFoundHandler);
    app.use(errorHander);

    return app
}

