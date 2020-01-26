import { botName } from "../env";
import { Logger } from './Logger';

export class Chatter {
  name = botName || 'Nameless bot';

  attributeStressBase = 
    '&{template:default}' + 
    '{{name=Stress for {0} }}' + 
    '{{Type={1} }}' + 
    '{{Effect= {2} }}' + 
    '{{New value= @{{0}|{3}} {3} }}' +
    '{{Stress level= {4} }}'

  sendBotMessage(message: string) {
    Logger.getInstance().debug(`Sending message ${message}`)
    sendChat(this.name, message, () => {}, {noarchive:true});
  }

  sendStressGainedMessage(stress: StressItem, stressedCharacter: StressedCharacter) {
    let message = this.stringFormat(
      this.attributeStressBase,
      stressedCharacter.name,
      'Gained',
      stress.name,
      stress.targetAttribute,
      ""+stressedCharacter.stressValue    
    );

    this.sendBotMessage(message);
  }

  sendStressLostMessage(stress: StressItem, stressedCharacter: StressedCharacter) {
    let message = this.stringFormat(
      this.attributeStressBase,
      stressedCharacter.name,
      'Lost',
      stress.name,
      stress.targetAttribute,
      ""+stressedCharacter.stressValue    
    );

    this.sendBotMessage(message);
  }

  private stringFormat(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  }
}
