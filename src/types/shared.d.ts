type LogLevel = 'debug' | 'info' | 'error' | 'off';
type Environment = 'prod' | 'test';

interface CommandHandler {
  handle: (message: ChatEventData) => void;
}