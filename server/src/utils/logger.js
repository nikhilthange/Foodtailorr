// Structured logger for Food Tailor
import { env } from '../config/env.js';

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = env.isProd ? LOG_LEVELS.info : LOG_LEVELS.debug;

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();
  const base = { timestamp, level, message };
  if (meta && Object.keys(meta).length > 0) {
    Object.assign(base, { meta });
  }
  return env.isProd ? JSON.stringify(base) : `[${timestamp}] ${level.toUpperCase()}: ${message}${meta ? ' ' + JSON.stringify(meta) : ''}`;
}

export const logger = {
  error(message, meta) {
    if (currentLevel >= LOG_LEVELS.error) console.error(formatMessage('error', message, meta));
  },
  warn(message, meta) {
    if (currentLevel >= LOG_LEVELS.warn) console.warn(formatMessage('warn', message, meta));
  },
  info(message, meta) {
    if (currentLevel >= LOG_LEVELS.info) console.log(formatMessage('info', message, meta));
  },
  debug(message, meta) {
    if (currentLevel >= LOG_LEVELS.debug) console.log(formatMessage('debug', message, meta));
  },
};
