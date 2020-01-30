import { StressStateManager } from '../persistence/StressStateManager';
import { StressProcessorService } from '../services/StressProcessorService';
import { Roll20Util } from '../../shared/Roll20Util';
import { StressChatter } from '../util/StressChatter';
import { Logger } from '../../shared/Logger';
import { StressAbilityCreator } from '../util/StressAbilityCreator';
import { StressFileWriter } from '../util/StressFileWriter';

export class StressCommandHandler {
  stressStateManager: StressStateManager;
  stressProcessor: StressProcessorService;
  stressAbilityCreator: StressAbilityCreator;
  stressFileWriter: StressFileWriter;
  chatter: StressChatter;

  public constructor(
    stressStateManager: StressStateManager,
    stressProcessor: StressProcessorService,
    stressAbilityCreator: StressAbilityCreator,
    stressFileWriter: StressFileWriter,
    chatter: StressChatter
  ) {
    this.stressStateManager = stressStateManager;
    this.stressProcessor = stressProcessor;
    this.stressAbilityCreator = stressAbilityCreator;
    this.stressFileWriter = stressFileWriter;
    this.chatter = chatter;
    this.register();
  }

  register() {
    Logger.info('Registering Stress Command Handler');

    on('chat:message', (message: ChatEventData) => {
      this.handle(message);
    });
  }

  handle(message: ChatEventData) {
    if (message.type !== 'api') {
      return;
    }

    const playerCharacter = this.extractPlayerCharacterFromMessage(message);

    if (message.content.indexOf('!stress') !== -1 && playerCharacter) {
      this.handleNewStressCharacter(playerCharacter);
    } else if (!playerCharacter) {
      return;
    }

    const stressedCharacter = this.findStressedCharacterByPlayerCharacter(playerCharacter);

    if (message.content.indexOf('!+-stress') !== -1 && stressedCharacter) {
      this.handleStressUpdate(message, stressedCharacter);
    }

    if (message.content.indexOf('!perseverence') !== -1 && stressedCharacter) {
      this.handlePerseverenceUpdate(message, stressedCharacter);
    }
  }

  private handleNewStressCharacter(playerCharacter: PlayerCharacter) {
    const stressedCharacter = this.stressStateManager.addNewStressedCharacter(playerCharacter);

    if (stressedCharacter !== undefined) {
      this.stressAbilityCreator.createStressAbilityOnCharacter(playerCharacter);
      this.stressFileWriter.createEmptyStressNote(playerCharacter);
      this.chatter.sendWelcomeMessage(playerCharacter);
    }
  }

  private handleStressUpdate(message: ChatEventData, stressedCharacter: StressedCharacter) {
    const amount = this.extractStressAmount(message.content);

    if (!amount) {
      this.chatter.sendFeedback(stressedCharacter.playerId, `Amount can only be numbers`);
      return;
    }

    if (amount > 0) {
      this.handleAddStress(amount, stressedCharacter);
    } else {
      this.handleRemoveStress(amount, stressedCharacter);
    }
  }

  private handlePerseverenceUpdate(message: ChatEventData, stressedCharacter: StressedCharacter) {
    const uuid = this.extractPerseverenceUuid(message.content);
    this.stressProcessor.processPerseverenceRemoval(stressedCharacter, uuid);
  }

  private handleAddStress(amountToAdd: number, stressedCharacter: StressedCharacter) {
    this.stressProcessor.processStressGain({
      ...stressedCharacter,
      amount: amountToAdd,
      oldStressValue: stressedCharacter.stressValue
    });
  }

  private handleRemoveStress(amountToRemove: number, stressedCharacter: StressedCharacter) {
    this.stressProcessor.processStressLoss({
      ...stressedCharacter,
      amount: amountToRemove,
      oldStressValue: stressedCharacter.stressValue
    });
  }

  private extractPerseverenceUuid(message: string): string {
    return message.substr(message.indexOf(' ') + 1);
  }

  private extractStressAmount(message: string): number | undefined {
    const numbersRegex = /^-?[0-9]+$/;
    const amount = message.substr(message.indexOf(' ') + 1);

    if (amount.match(numbersRegex)) {
      return +amount;
    }

    return;
  }

  private extractPlayerCharacterFromMessage (
    message: ChatEventData
  ): PlayerCharacter | undefined {
    const apiChatEvent = message as ApiChatEventData;
    if (!apiChatEvent.selected || apiChatEvent.selected.length !== 1) {
      this.chatter.sendFeedback(
        message.playerid,
        'Make sure to only select 1 token. And that token is associated with a character.'
      );
      return;
    }

    const character = Roll20Util.getCharacterFromTokenId(apiChatEvent.selected[0]._id);

    // Make sure the token info is correct
    if (!character) {
      return;
    }

    const playerCharacter: PlayerCharacter = {
      characterId: character.get('_id'),
      playerId: message.playerid,
      name: character.get('name')
    };

    return playerCharacter;
  }

  private findStressedCharacterByPlayerCharacter(
    playerCharacter: PlayerCharacter
  ): StressedCharacter | undefined {
    const stressedCharacter = this.stressStateManager.getStressedCharacter(playerCharacter);

    // Make sure we have this character registered
    if (!stressedCharacter) {
      Logger.error(`Tried to add stress for unknown character: ${playerCharacter.name}`);
      return;
    }

    return stressedCharacter;
  }
}
