import { logLevel } from '../env';

export class Logger {
    private static instance: Logger;
    logLevel: LogLevel;

    private constructor(loglevel: LogLevel) {
      this.logLevel = loglevel;
    }

    public static getInstance(): Logger {
      if(!Logger.instance) {
        Logger.instance = new Logger(logLevel);
      }

      return Logger.instance;
    }

    debug(message: string) {
      if (this.logLevel === 'debug') {
        log('DEBUG: ' + message);
      }
    }

    info(message: string) {
      if (this.logLevel === 'debug' || this.logLevel === 'info') {
        log('INFO: ' + message);
      }
    }

    error(message: string) {
      if (
        this.logLevel === 'debug' ||
        this.logLevel === 'info' ||
        this.logLevel === 'error'
      ) {
        log('ERROR: ' + message);
      }
    }
  }
