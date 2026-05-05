import pino from 'pino';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

let logger;

if (isProduction) {
  const logDir = path.resolve('logs');
  const logPath = path.join(logDir, 'app.log');
  fs.mkdirSync(logDir, { recursive: true });

  logger = pino({
    transport: {
      targets: [
        { target: 'pino-pretty', options: { colorize: true } },
        { target: 'pino/file', options: { destination: logPath } },
      ],
    },
  });
} else {
  // dev/test/e2e — console only, no file writing
  logger = pino({
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  });
}

export { logger };
