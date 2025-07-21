// logger.js - Core Pino logger setup
// Used for general logging across all services

import pino from 'pino';
import fs from 'fs';
import path from 'path';


// Define log file path
const logPath = path.resolve('logs', 'app.log');
fs.mkdirSync(path.dirname(logPath), { recursive: true });

// Create file stream destination
const destination = pino.destination(logPath);
export const logger = pino({}, destination); // default config

