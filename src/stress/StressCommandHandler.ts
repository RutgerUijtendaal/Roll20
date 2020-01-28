import { Logger } from '../shared/Logger';
import { StressStateManager } from './StressStateManager';
import { StressProcessor } from './StressProcessor';
import { getCharacterFromTokenId } from '../shared/util';

export class StressCommandHandler implements CommandHandler {
  stressStateManager: StressStateManager;
  stressProcessor: StressProcessor;
  logger: Logger;

  public constructor(
    stressStateManager: StressStateManager,
    stressProcessor: StressProcessor,
  ) {
    this.logger = Logger.getInstance();
    this.stressStateManager = stressStateManager;
    this.stressProcessor = stressProcessor;
    this.register();
  }

  register() {
    this.logger.info('Registering Stress Command Handler');

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
      this.logger.error(`Undefined character found for message`)
      return;
    }

    if (message.content.indexOf('!stress') !== -1) {
      this.handleNewStressCharacter(message, playerCharacter);
    }

    if (message.content.indexOf('!+stress') !== -1) {
      this.handleAddStress(message, playerCharacter);
    }

    if (message.content.indexOf('!-stress') !== -1) {
      this.handleRemoveStress(message, playerCharacter);
    }
  }

  private handleNewStressCharacter(message: ChatEventData, playerCharacter: PlayerCharacter) {
    this.stressStateManager.addNewStressedCharacter(playerCharacter);

    return;
  }

  private handleAddStress(message: ChatEventData, playerCharacter: PlayerCharacter) {
    const amountToAdd = this.extractStressAmount(message.content);

    if (!amountToAdd) {
      return;
    }

    this.stressProcessor.processStressAddition({
      ...playerCharacter,
      amount: amountToAdd
    });

    return;
  }

  private handleRemoveStress(message: ChatEventData, playerCharacter: PlayerCharacter) {
    const amountToRemove = this.extractStressAmount(message.content);

    if (!amountToRemove) {
      return;
    }

    this.stressProcessor.processStressRemoval({
      ...playerCharacter,
      amount: amountToRemove * -1
    });
  }

  private extractStressAmount(message: string): number | undefined {
    const numbersRegex = /^[0-9]+$/;
    const amount = message.substr(message.indexOf(' ') + 1);

    if (amount.match(numbersRegex)) {
      return +amount;
    }

    this.logger.error('Stress update command contained more than just numbers');
    return undefined;
  }

  private extractPlayerCharacterFromMessage(message: ChatEventData): PlayerCharacter | undefined {
    const apiChatEvent = (message as ApiChatEventData);

    if(apiChatEvent.selected !== undefined && apiChatEvent.selected.length === 1) {
      const character = getCharacterFromTokenId(apiChatEvent.selected[0]._id);

      if(character !== undefined) {
        const playerCharacter: PlayerCharacter = {
          characterId: character.get('_id'),
          playerId: message.playerid,
          name: character.get('name')
        }

        this.logger.debug(`name: ${playerCharacter.name}, id: ${playerCharacter.characterId}`)
        return playerCharacter;
      }
    } 

    return;
  }
}
