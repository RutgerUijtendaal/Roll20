type LogLevel = 'debug' | 'info' | 'error' | 'off';
type Environment = 'prod' | 'test';

interface Logger {
  initialize: (LogLevel: LogLevel) => void;
  debug: (message: String) => void;
  info: (message: String) => void;
  error: (message: String) => void;
}
