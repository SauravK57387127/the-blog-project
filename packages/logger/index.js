// logger.js - Core Pino logger setup
// Used for general logging across all services

// import pino from 'pino';
// import fs from 'fs';
// import path from 'path';


// // Define log file path
// const logPath = path.resolve('logs', 'app.log');
// fs.mkdirSync(path.dirname(logPath), { recursive: true });

// // Create file stream destination
// const destination = pino.destination(logPath);
// export const logger = pino({}, destination); // default config






// Modified approach

import pino from 'pino';
import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
const logPath = path.join(logDir, 'app.log');

// Ensure log directory exists
fs.mkdirSync(logDir, { recursive: true });

// Create file stream with pretty console logs
const destination = pino.destination({ dest: logPath, sync: false });

// Configure pino to log to both file and console
export const logger = pino(
  {
    transport: {
      targets: [
        { target: 'pino-pretty', options: { colorize: true } }, // Console
        { target: 'pino/file', options: { destination: logPath } }, // File
      ],
    },
  },
  destination
);





// export const logger = {
//   info: console.log,
//   error: console.error,
//   warn: console.warn
// };

