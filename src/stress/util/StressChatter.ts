import { Chatter } from '../../shared/Chatter';
import { Roll20Util } from '../../shared/Roll20Util';
import { Logger } from '../../shared/Logger';

export class StressChatter extends Chatter {
  welcomeMessage = 'Welcome to the world of stress.';
  instructionOne =
    'An ability has been added to your token to control your stress. ' +
    'You can find it wherever you have your ability buttons when you select your token';
  instructionTwo =
    "2 Notes have been assigned to you. One holds your Stress list. I'll update that one. " +
    "The other one is for Perseverence buffs. I add new Perseverence gained to this, but it's up to you to remove them.";

  // TODO build these messages based on multiple attributes
  attributeStressBase =
    '&{template:default}' +
    '{{name=Stress for {0} }}' +
    '{{Type={1} }}' +
    '{{Effect= {2} }}' +
    '{{Stress level= {3} }}';

  // TODO build these messages based on multiple attributes
  doubleAttributeStressBase =
    '&{template:default}' +
    '{{name=Double Stress for {0} }}' +
    '{{Type={1} }}' +
    '{{Old effect = {2} }}' +
    '{{Additional effect = {3} }}' +
    '{{Stress level= {4} }}';

  sendWelcomeMessage(playerCharacter: PlayerCharacter) {
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(playerCharacter.playerId),
      this.welcomeMessage
    );
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(playerCharacter.playerId),
      this.instructionOne
    );
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(playerCharacter.playerId),
      this.instructionTwo
    );
  }

  sendStressGainedWhisper(stressUpdate: StressUpdate) {
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(stressUpdate.playerId),
      `Gained ${stressUpdate.amount} stress`
    );
  }

  sendStressLostWhisper(stressUpdate: StressUpdate) {
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(stressUpdate.playerId),
      `Lost ${stressUpdate.amount} stress`
    );
  }

  sendDoubleStressDebuffGainedMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendDoubleStressMessage(stressedCharacter, stress, 'Gained');
  }

  sendDoubleStressDebuffLostMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendDoubleStressMessage(stressedCharacter, stress, 'Lost');
  }

  sendStressDebuffGainedMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendStressMessage(stressedCharacter, stress, 'Gained');
  }

  sendStressDebuffLostMessage(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.sendStressMessage(stressedCharacter, stress, 'Lost');
  }

  private sendStressMessage(
    stressedCharacter: StressedCharacter,
    stress: StressItem,
    type: string
  ) {
    let message = this.stringFormat(
      this.attributeStressBase,
      stressedCharacter.name,
      type,
      stress.name,
      '' + stressedCharacter.stressValue
    );

    this.sendBotAnnouncement(message);
  }

  private sendDoubleStressMessage(
    stressedCharacter: StressedCharacter,
    stress: StressItem,
    type: string
  ) {
    if (!stress.mixin) {
      Logger.error(
        `Tried to send doubleStressDebuffLost message for ${stressedCharacter.name}, but mixin was undefined.`
      );
      return;
    }

    let message = this.stringFormat(
      this.doubleAttributeStressBase,
      stressedCharacter.name,
      type,
      stress.name,
      stress.mixin.name,
      '' + stressedCharacter.stressValue
    );

    this.sendBotAnnouncement(message);
  }
}
