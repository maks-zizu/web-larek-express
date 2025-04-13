import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

const logsDir = path.join(__dirname, '../../logs');

// Логирует запрос
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'request.log'),
    }),
  ],
  format: winston.format.json(),
});

// Логирует ошибки
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
    }),
  ],
  format: winston.format.json(),
});

// Логирует в консоль
export const appLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.simple(),
});
