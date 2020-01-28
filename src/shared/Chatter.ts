import { botName } from "../env";
import { Logger } from './Logger';
import { getPlayerDisplayName } from "./util";

export class Chatter {
  name = botName || 'Nameless bot';

  attributeStressBase = 
    '&{template:default}' + 
    '{{name=Stress for {0} }}' + 
    '{{Type={1} }}' + 
    '{{Effect= {2} }}' + 
    '{{New value= @{{0}|{3}} {3} }}' +
    '{{Stress level= {4} }}'

  doubleAttributeStressBase = 
    '&{template:default}' + 
    '{{name=Double Stress for {0} }}' + 
    '{{Type={1} }}' + 
    '{{Old effect = {2} }}' + 
    '{{Value= @{{0}|{3}} {3} }}' +
    '{{Additional effect = {4} }}' + 
    '{{New value= @{{0}|{5}} {5} }}' +
    '{{Stress level= {6} }}'

  sendStressGainedWhisper(stressedCharacter: StressedCharacter, amount: number) {
    this.sendBotWhisper(getPlayerDisplayName(stressedCharacter), `Gained ${amount} stress`)
  }

  sendStressLostWhisper(stressedCharacter: StressedCharacter, amount: number) {
    this.sendBotWhisper(getPlayerDisplayName(stressedCharacter), `Lost ${amount} stress`)
  }

  sendDoubleStressDebuffGainedMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendDoubleStressMessage(stressedCharacter, stress, 'Gained')
  }

  sendDoubleStressDebuffLostMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendDoubleStressMessage(stressedCharacter, stress, 'Lost')
  }

  sendStressDebuffGainedMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendStressMessage(stressedCharacter, stress, 'Gained')

  }

  sendStressDebuffLostMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendStressMessage(stressedCharacter, stress, 'Lost')
  }

  private sendStressMessage(stressedCharacter: StressedCharacter, stress: StressItem, type: string) {
    let message = this.stringFormat(
      this.attributeStressBase,
      stressedCharacter.name,
      type,
      stress.name,
      stress.targetAttribute,
      ""+stressedCharacter.stressValue    
    );

    this.sendBotAnnouncement(message);
  }

  private sendDoubleStressMessage(stressedCharacter: StressedCharacter, stress: StressItem, type: string) {
    if(!stress.mixin) {
      Logger.getInstance().error(`Tried to send doubleStressDebuffLost message for ${stressedCharacter.name}, but mixin was undefined.`)
      return;
    }

    let message = this.stringFormat(
      this.doubleAttributeStressBase,
      stressedCharacter.name,
      type,
      stress.name,
      stress.targetAttribute,
      stress.mixin.name,
      stress.mixin.targetAttribute,
      ""+stressedCharacter.stressValue    
    );

    this.sendBotAnnouncement(message);
  }

  private stringFormat(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  }

  private sendBotWhisper(to: string, content: string) {
    const message = `/w "${to}" ${content}`
    Logger.getInstance().debug(`Sending message ${message}`)
    sendChat("", message, null, {noarchive:true})
  }

  private sendBotAnnouncement(message: string) {
    Logger.getInstance().debug(`Sending message ${message}`)
    sendChat(this.name, message, null, {noarchive:true});
  }

}
