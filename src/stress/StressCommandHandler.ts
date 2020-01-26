import { Logger } from '../shared/Logger';
import { StressStateManager } from './StressStateManager';

export class StressCommandHandler implements CommandHandler {
  stressStateManager: StressStateManager;
  logger: Logger;

  public constructor() {
    this.logger = Logger.getInstance();
    this.stressStateManager = new StressStateManager();
    this.register()
  }

  register() {
    this.logger.info('Registering Stress module');

    on("chat:message", (message: ChatEventData) => {
      this.handle(message);
    })
  }

  handle(message: ChatEventData) {
    if (message.type !== 'api') {
      return;
    }

    if (message.content.indexOf('!stress') !== -1) {
      this.stressStateManager.addNewStressedCharacter({
        name: message.who,
        id: message.playerid
      });
  
      return;
    }
  
    /**
     * Add stress to a character. Character is based on who
     * If value given is not just numbers request is discarded
     */
    if (message.content.indexOf('!+stress') !== -1) {
      const amountToAdd = this.extractStressAmount(message.content);
  
      if (!amountToAdd) {
        return;
      }
  
      this.stressStateManager.addStress({
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
    if (message.content.indexOf('!-stress') !== -1) {
      log(message.who);
      log(message.playerid);
      return;
    }
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