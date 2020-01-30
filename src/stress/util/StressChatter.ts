import { Chatter } from '../../shared/Chatter';
import { Roll20Util } from '../../shared/Roll20Util';
import { Logger } from '../../shared/Logger';

export class StressChatter extends Chatter {
  welcomeMessage = 'Welcome to the world of stress.';
  instructionOne =
    'An ability has been added to your token to control your stress. ' +
    'You can find it wherever you have your ability buttons when you select your token';
  instructionTwo = 'A handout has been assigned to you. It holds 2 lists.';
  instructionThree = "1. Your Stress list, I'll keep this one up to date.";
  instructionFour =
    "2. A Perseverence list. I add new Perseverence gained to this, but it's up to you to remove them.";

  // TODO build these messages based on multiple attributes
  colorMessageRed = '{{save=1}}';
  colorMessageGreen = '{{weapon=1}}';
  colorMessageBlue = '{{ability=1}}';
  colorMessagePurple = '{{spell=1}}';

  attributeDisplay = '{{{0} = @{{1}|{2}} {0} }}';

  attributeStressBase =
    '&{template:5eDefault}' +
    '{{showclassactions=1}}' +
    '{{title=Stress {0}}}' +
    '{{subheader= {1} }}' +
    '{{Effect= {2} }}' +
    '{{=Updated values}}';

  doubleAttributeStressBase =
    '&{template:5eDefault}' +
    '{{showclassactions=1}}' +
    '{{title=Double Stress {0}}}' +
    '{{subheader= {1} }}' +
    '{{Effect #1 = {2} }}' +
    '{{Effect #2 = {3} }}' +
    '{{=Updated Values}}';

  perseverenceBase =
    '&{template:5eDefault}' +
    '{{showclassactions=1}}' +
    '{{title=Perseverence {0} }}' +
    '{{subheader= {1} }}' +
    '{{Effect= {3} }}' +
    '{{Description= {4} }}';

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
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(playerCharacter.playerId),
      this.instructionThree
    );
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(playerCharacter.playerId),
      this.instructionFour
    );
  }

  sendStressChangedMessage(stressUpdate: StressUpdate) {
    stressUpdate.amount = stressUpdate.stressValue - stressUpdate.oldStressValue;
    if (stressUpdate.amount >= 0) {
      this.sendStressGainedWhisper(stressUpdate);
    } else {
      this.sendStressLostWhisper(stressUpdate);
    }
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

  sendPerseverenceGainedMessage(
    stressedCharacter: StressedCharacter,
    perseverence: PerseverenceItem
  ) {
    this.sendPerseverenceMessage(stressedCharacter, perseverence, 'Gained');
  }

  sendPerseverenceLostMessage(
    stressedCharacter: StressedCharacter,
    perseverence: PerseverenceItem
  ) {
    this.sendPerseverenceMessage(stressedCharacter, perseverence, 'Lost');
  }

  private sendStressGainedWhisper(stressUpdate: StressUpdate) {
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(stressUpdate.playerId),
      `Gained ${stressUpdate.amount} stress. You're now on ${stressUpdate.stressValue} total stress.`
    );
  }

  private sendStressLostWhisper(stressUpdate: StressUpdate) {
    this.sendBotWhisper(
      Roll20Util.getPlayerDisplayNameById(stressUpdate.playerId),
      `Lost ${stressUpdate.amount} stress. You're now on ${stressUpdate.stressValue} total stress.`
    );
  }

  private sendPerseverenceMessage(
    stressedCharacter: StressedCharacter,
    perseverence: PerseverenceItem,
    type: StressMessageType
  ) {
    let message = this.stringFormat(
      this.perseverenceBase,
      type,
      stressedCharacter.name,
      '' + stressedCharacter.stressValue,
      perseverence.name,
      perseverence.desc
    );

    if(type === 'Gained') {
      message += this.colorMessagePurple
    } else {
      message += this.colorMessageBlue
    }

    this.sendBotAnnouncement(message);
  }

  private sendStressMessage(
    stressedCharacter: StressedCharacter,
    stress: StressItem,
    type: StressMessageType
  ) {
    let message = this.stringFormat(
      this.attributeStressBase,
      type,
      stressedCharacter.name,
      stress.name
    );

    if(type === 'Gained') {
      message += this.colorMessageRed
    } else {
      message += this.colorMessageGreen
    }

    stress.targetAttributes.forEach(targetAttribute => {
      message += this.stringFormat(
        this.attributeDisplay,
        targetAttribute.name,
        stressedCharacter.name,
        targetAttribute.target
      );
    });

    this.sendBotAnnouncement(message);
  }

  private sendDoubleStressMessage(
    stressedCharacter: StressedCharacter,
    stress: StressItem,
    type: StressMessageType
  ) {
    if (!stress.mixin) {
      Logger.error(
        `Tried to send doubleStressDebuffLost message for ${stressedCharacter.name}, but mixin was undefined.`
      );
      return;
    }

    let message = this.stringFormat(
      this.doubleAttributeStressBase,
      type,
      stressedCharacter.name,
      stress.name,
      stress.mixin.name
    );

    if(type === 'Gained') {
      message += this.colorMessageRed
    } else {
      message += this.colorMessageGreen
    }

    stress.mixin.targetAttributes.forEach(targetAttribute => {
      message += this.stringFormat(
        this.attributeDisplay,
        targetAttribute.name,
        stressedCharacter.name,
        targetAttribute.target
      );
    });


    this.sendBotAnnouncement(message);
  }
}
