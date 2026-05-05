import pinoHttp from 'pino-http';
import { logger } from './index.js'; // dot‑slash to same folder

export const httpLogger = pinoHttp({ logger });
export default httpLogger;
