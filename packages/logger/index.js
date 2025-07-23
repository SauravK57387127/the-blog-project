import pino from 'pino';
import fs from 'fs';
import path from 'path';




const logDir = path.resolve('logs');
const logPath = path.join(logDir, 'app.log');

fs.mkdirSync(logDir, { recursive: true });

const destination = pino.destination({ dest: logPath, sync: false });


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



