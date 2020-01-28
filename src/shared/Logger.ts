import { logLevel } from '../env';

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
