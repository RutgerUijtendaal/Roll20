import { botName } from "../env";
import { Logger } from './Logger';
import { Roll20Util } from './Roll20Util';

/**
 * Chatter provides a basic interface for sending messages through the Roll20 chat.
 */
export abstract class Chatter {
  name = botName || 'Nameless bot';

  /**
   * 
   * @param playerId 
   * @param message 
   */
  sendFeedback(playerId: string, message: string) {
    this.sendBotWhisper(Roll20Util.getPlayerDisplayNameById(playerId), message)
  }
  
  /**
   * sendBotWhisper provides a way of sending whispers to a specified Player.
   * 
   * Whispers are based on the display name of a player. A utility function exists to get
   * the display name by it's id. {@link Roll20Util#getPlayerDisplayNameById}.
   * 
   * @param to The display name of a Player
   * @param content Body of the message
   * @param archive optional. If a message should be archived. Defaults to false.
   */
  protected sendBotWhisper(to: string, content: string, archive=false) {
    Logger.debug(`Sending whisper '${content}' to ${to}`)
    const message = `/w "${to}" ${content}`
    sendChat(this.name, message, null, {noarchive:!archive})
  }

  /**
   * sendBotAnnouncment provides a way of sending a broadcast to everyone in the game 
   * through the chat.
   * 
   * @param message body of message
   * @param archive optional. If a message should be archived. Defaults to false.
   */
  protected sendBotAnnouncement(message: string, archive=false) {
    Logger.debug(`Sending message ${message}`)
    sendChat(this.name, message, null, {noarchive:!archive});
  }

  protected stringFormat(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  }
}
