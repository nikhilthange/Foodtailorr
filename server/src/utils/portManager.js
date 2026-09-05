// Food Tailor — Cross-Platform Port & Process Lifecycle Manager
import net from 'net';
import { execSync } from 'child_process';
import { logger } from './logger.js';

/**
 * Checks if a TCP port is available for binding
 * @param {number} port 
 * @param {string} host 
 * @returns {Promise<boolean>}
 */
export function isPortAvailable(port, host = '0.0.0.0') {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.once('close', () => resolve(true)).close();
    });
    server.listen(port, host);
  });
}

/**
 * Checks if an existing Food Tailor API is responding on the port
 * @param {number} port 
 * @param {number} timeoutMs 
 * @returns {Promise<boolean>}
 */
export async function isFoodTailorHealthy(port, timeoutMs = 800) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`http://localhost:${port}/api/health`, {
      signal: controller.signal,
    }).catch(() => null);
    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => ({}));
      return data.status === 'ok' || data.status === 'healthy';
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Finds the Process ID (PID) holding a given local TCP port
 * @param {number} port 
 * @returns {number|null}
 */
export function getProcessOnPort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano -p tcp | findstr :${port} | findstr LISTENING`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const lines = output.trim().split(/\r?\n/);
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[parts.length - 1], 10);
        if (pid && !isNaN(pid) && pid !== process.pid) {
          return pid;
        }
      }
    } else {
      const output = execSync(`lsof -ti:${port}`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const pid = parseInt(output.trim(), 10);
      if (pid && !isNaN(pid) && pid !== process.pid) {
        return pid;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Gracefully or forcefully frees a port if held by a stale process
 * @param {number} port 
 * @param {number} maxWaitMs 
 * @returns {Promise<boolean>}
 */
export async function freePortIfOccupied(port, maxWaitMs = 3000) {
  const isFree = await isPortAvailable(port);
  if (isFree) return true;

  const stalePid = getProcessOnPort(port);
  if (!stalePid || stalePid === process.pid) {
    // Might be in TIME_WAIT or closing; wait briefly
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      await new Promise((r) => setTimeout(r, 200));
      if (await isPortAvailable(port)) return true;
    }
    return false;
  }

  logger.warn(`Port ${port} is occupied by stale process PID ${stalePid}. Terminating to reclaim port...`);

  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /PID ${stalePid}`, { stdio: 'ignore' });
    } else {
      process.kill(stalePid, 'SIGKILL');
    }
  } catch (err) {
    logger.warn(`Could not kill PID ${stalePid}: ${err.message}`);
  }

  // Poll until released
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 200));
    if (await isPortAvailable(port)) {
      logger.info(`✅ Port ${port} successfully reclaimed from PID ${stalePid}`);
      return true;
    }
  }

  return false;
}
