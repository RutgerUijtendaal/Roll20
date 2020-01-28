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

    if(playerCharacter === undefined) {
      this.chatter.sendFeedback((message.playerid), 'Make sure to only select 1 token. And that token is associated with a character');
      Logger.error(`No character found for message`)
      return;
    }

    if (message.content.indexOf('!stress') !== -1) {
      this.handleNewStressCharacter(message, playerCharacter);
    }

    if (message.content.indexOf('!+-stress') !== -1) {
      this.handleStressUpdate(message, playerCharacter);
    }
  }

  private handleNewStressCharacter(message: ChatEventData, playerCharacter: PlayerCharacter) {
    const stressedCharacter = this.stressStateManager.addNewStressedCharacter(playerCharacter);

    if(stressedCharacter !== undefined) {
      this.stressAbilityCreator.createStressAbilityOnCharacter(playerCharacter);
      this.stressFileWriter.createEmptyStressNote(playerCharacter);
      this.chatter.sendWelcomeMessage(playerCharacter);
    }
  }

  private handleStressUpdate(message: ChatEventData, playerCharacter: PlayerCharacter) {
    const amount = this.extractStressAmount(message.content);

    if (!amount) {
      this.chatter.sendFeedback(playerCharacter.playerId, `Amount can only be numbers`)
      return;
    }

    if(amount > 0) {
      this.handleAddStress(amount, playerCharacter);
    } else {
      this.handleRemoveStress(amount, playerCharacter);
    }
  }


  private handleAddStress(amountToAdd: number, playerCharacter: PlayerCharacter) {
    this.stressProcessor.processStressAddition({
      ...playerCharacter,
      amount: amountToAdd
    });
  }

  private handleRemoveStress(amountToRemove: number, playerCharacter: PlayerCharacter) {
    this.stressProcessor.processStressRemoval({
      ...playerCharacter,
      amount: amountToRemove
    });
  }

  private extractStressAmount(message: string): number | undefined {
    const numbersRegex = /^-?[0-9]+$/;
    const amount = message.substr(message.indexOf(' ') + 1);

    if (amount.match(numbersRegex)) {
      return +amount;
    }

    Logger.error('Stress update command contained more than just numbers');
    return undefined;
  }

  private extractPlayerCharacterFromMessage(message: ChatEventData): PlayerCharacter | undefined {
    const apiChatEvent = (message as ApiChatEventData);

    if(apiChatEvent.selected !== undefined && apiChatEvent.selected.length === 1) {
      const character = Roll20Util.getCharacterFromTokenId(apiChatEvent.selected[0]._id);

      if(character !== undefined) {
        const playerCharacter: PlayerCharacter = {
          characterId: character.get('_id'),
          playerId: message.playerid,
          name: character.get('name')
        }

        Logger.debug(`name: ${playerCharacter.name}, id: ${playerCharacter.characterId}`)
        return playerCharacter;
      }
    } 
    return;
  }
}
