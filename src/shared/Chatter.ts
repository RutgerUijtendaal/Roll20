import { botName } from "../env";
import { Logger } from './Logger';
import { Roll20Util } from './Roll20Util';

export class Chatter {
  name = botName || 'Nameless bot';

  protected sendBotWhisper(to: string, content: string) {
    const message = `/w "${to}" ${content}`
    Logger.debug(`Sending message ${message}`)
    sendChat(this.name, message, null, {noarchive:true})
  }

  protected sendBotAnnouncement(message: string) {
    Logger.debug(`Sending message ${message}`)
    sendChat(this.name, message, null, {noarchive:true});
  }

  protected stringFormat(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  }
}
