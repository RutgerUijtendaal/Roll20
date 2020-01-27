import { Logger } from '../shared/Logger';
import { StressStateManager } from './StressStateManager';
import { StressProcessor } from './StressProcessor';
import { StressAbilityCreator } from './StressAbilityCreator';

export class StressCommandHandler implements CommandHandler {
  stressStateManager: StressStateManager;
  stressProcessor: StressProcessor;
  stressAbilityCreator: StressAbilityCreator;
  logger: Logger;

  public constructor(
    stressStateManager: StressStateManager,
    stressProcessor: StressProcessor,
    stressAbilityCreator: StressAbilityCreator
  ) {
    this.logger = Logger.getInstance();
    this.stressStateManager = stressStateManager;
    this.stressProcessor = stressProcessor;
    this.stressAbilityCreator = stressAbilityCreator;
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

    // TODO Check if character is player character ?

    if (message.content.indexOf('!stress') !== -1) {
      this.handleNewStressCharacter(message);
    }

    if (message.content.indexOf('!+stress') !== -1) {
      this.handleAddStress(message);
    }

    if (message.content.indexOf('!-stress') !== -1) {
      this.handleRemoveStress(message);
    }
  }

  /**
   * Add stress to a character. Character is based on who
   * If value given is not just numbers request is discarded
   */
  private handleNewStressCharacter(message: ChatEventData) {
    const playerCharacter: PlayerCharacter = {
      name: message.who,
      id: message.playerid
    }

    this.stressAbilityCreator.createStressAbilitiesOnCharacter(playerCharacter);
    this.stressStateManager.addNewStressedCharacter(playerCharacter);

    return;
  }

  /**
   * Add stress to a character. Character is based on who
   * If value given is not just numbers request is discarded
   */
  private handleAddStress(message: ChatEventData) {
    const amountToAdd = this.extractStressAmount(message.content);

    if (!amountToAdd) {
      return;
    }

    this.stressProcessor.processStressAddition({
      name: message.who,
      id: message.playerid,
      amount: amountToAdd
    });

    return;
  }

  /**
   * Remove stress from a character.
   * If value given is not just numbers request is discarded
   */
  private handleRemoveStress(message: ChatEventData) {
    const amountToAdd = this.extractStressAmount(message.content);

    if (!amountToAdd) {
      return;
    }

    this.stressProcessor.processStressRemoval({
      name: message.who,
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
}
