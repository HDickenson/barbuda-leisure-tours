/**
 * Logger configuration and setup
 * Uses Winston for structured logging
 */

import winston from 'winston';
import type { LogLevel } from './Config';

/**
 * Create a configured logger instance
 * @param level Log level
 * @param logFile Optional file path for logging
 * @returns Configured Winston logger
 */
export function createLogger(
  level: LogLevel = 'info',
  logFile?: string,
): winston.Logger {
  const transports: winston.transport[] = [
    // Console transport with colored output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let log = `${timestamp} [${level}]: ${message}`;

          // Add metadata if present
          if (Object.keys(meta).length > 0) {
            log += `\n${JSON.stringify(meta, null, 2)}`;
          }

          return log;
        }),
      ),
    }),
  ];

  // Add file transport if specified
  if (logFile) {
    transports.push(
      new winston.transports.File({
        filename: logFile,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    );
  }

  return winston.createLogger({
    level,
    transports,
  });
}

/**
 * Create a child logger with a specific label
 * @param parent Parent logger
 * @param label Child logger label
 * @returns Child logger with label
 */
export function createChildLogger(
  parent: winston.Logger,
  label: string,
): winston.Logger {
  return parent.child({ component: label });
}

/**
 * Default logger instance (used when no custom logger provided)
 */
export const defaultLogger = createLogger('info');
