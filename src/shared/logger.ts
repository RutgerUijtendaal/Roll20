const currentLogLevel: LogLevel = 'debug';

var logger =
  logger ||
  (function(): Logger {
    var _logLevel: LogLevel;

    function initialize(loglevel: LogLevel) {
      _logLevel = loglevel;
    }

    function isInitialized(): boolean {
      return _logLevel !== null || undefined;
    }

    function debug(message: string) {
      if (!isInitialized()) {
        throw Error('Logger not initialized');
      }

      if (_logLevel === 'debug') {
        log('DEBUG: ' + message);
      }
    }

    function info(message: string) {
      if (!isInitialized()) {
        throw Error('Logger not initialized');
      }

      if (_logLevel === 'debug' || _logLevel === 'info') {
        log('INFO: ' + message);
      }
    }

    function error(message: string) {
      if (!isInitialized()) {
        throw Error('Logger not initialized');
      }

      if (
        _logLevel === 'debug' ||
        _logLevel === 'info' ||
        _logLevel === 'error'
      ) {
        log('ERROR: ' + message);
      }
    }

    return {
      initialize: initialize,
      debug: debug,
      info: info,
      error: error
    };
  })();

logger.initialize(currentLogLevel); 
