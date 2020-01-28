import { Logger } from '../shared/Logger';
import { StressStateManager } from './StressStateManager';
import { StressProcessor } from './StressProcessor';
import { getTokenNameFromId } from '../shared/util';

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
    this.logger.info('Registering Stress module');

    on('chat:message', (message: ChatEventData) => {
      this.handle(message);
    });
  }

  handle(message: ChatEventData) {
    if (message.type !== 'api') {
      return;
    }

    const name = this.extractTokenNameFromMessage(message);

    if(name === undefined) {
      this.logger.error(`Undefined name found for message`)
      return;
    }

    if (message.content.indexOf('!stress') !== -1) {
      this.handleNewStressCharacter(message, name);
    }

    if (message.content.indexOf('!+stress') !== -1) {
      this.handleAddStress(message, name);
    }

    if (message.content.indexOf('!-stress') !== -1) {
      this.handleRemoveStress(message, name);
    }
  }

  /**
   * Add stress to a character. Character is based on who
   * If value given is not just numbers request is discarded
   */
  private handleNewStressCharacter(message: ChatEventData, name: string) {
    const playerCharacter: PlayerCharacter = {
      name: name,
      id: message.playerid
    }

    this.stressStateManager.addNewStressedCharacter(playerCharacter);

    return;
  }

  /**
   * Add stress to a character. Character is based on who
   * If value given is not just numbers request is discarded
   */
  private handleAddStress(message: ChatEventData, name: string) {
    const amountToAdd = this.extractStressAmount(message.content);

    if (!amountToAdd) {
      return;
    }

    this.stressProcessor.processStressAddition({
      name: name,
      id: message.playerid,
      amount: amountToAdd
    });

    return;
  }

  /**
   * Remove stress from a character.
   * If value given is not just numbers request is discarded
   */
  private handleRemoveStress(message: ChatEventData, name: string) {
    const amountToAdd = this.extractStressAmount(message.content);

    if (!amountToAdd) {
      return;
    }

    this.stressProcessor.processStressRemoval({
      name: name,
      id: message.playerid,
      amount: amountToAdd * -1
    });
  }

  private extractStressAmount(message: string): number | null {
    const numbersRegex = /^[0-9]+$/;
    const amount = message.substr(message.indexOf(' ') + 1);

    if (amount.match(numbersRegex)) {
      return +amount;
    }

    // TODO
    // add way to inform player that his/her command sucks.
    this.logger.error('Stress update command contained more than just numbers');
    return null;
  }

  private extractTokenNameFromMessage(message: ChatEventData): string | undefined {
    const apiChatEvent = (message as ApiChatEventData);

    if(apiChatEvent.selected !== undefined && apiChatEvent.selected.length === 1) {
      return getTokenNameFromId(apiChatEvent.selected[0]._id);
    } else {
      return;
    }
  }
}
