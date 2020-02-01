import { logLevel } from '../env';

/**
 * Logger is a simple static class that expands on the existing Roll20 log system
 * to allow for different levels of logging.
 */
export class Logger {
  static debug(message: string) {
    if (logLevel === 'debug') {
      log(`DEBUG: ${message}`);
    }
  }

  static info(message: string) {
    if (logLevel === 'debug' || logLevel === 'info') {
      log(`INFO: ${message}`);
    }
  }

  static error(message: string) {
    if (logLevel === 'debug' || logLevel === 'info' || logLevel === 'error') {
      log(`ERROR: ${message}`);
    }
  }
}
