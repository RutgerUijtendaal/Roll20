import { StressItemManager } from './StressItemManager';
import { StressStateManager } from './StressStateManager';
import { Logger } from '../shared/Logger';

export class StressProcessor {
  readonly stressModifier = 5;
  logger: Logger;
  stressItemManager: StressItemManager;
  stressStateManager: StressStateManager;

  constructor(
    stressItemManager: StressItemManager,
    stressStateManager: StressStateManager
  ) {
    this.logger = Logger.getInstance();
    this.stressItemManager = stressItemManager;
    this.stressStateManager = stressStateManager;
  }

  /**
   * Add stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressAddition(stressUpdate: StressUpdate) {
    const stressCharacter = this.stressStateManager.getStressedCharacter(
      stressUpdate
    );

    if (stressCharacter === null) {
      this.logger.error(
        'Tried to add stress for unknown character: ' + stressUpdate.name
      );
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);

    this.updateStressAmount(stressCharacter, stressUpdate);
    this.addStresses(stressCharacter, diff);

    this.stressStateManager.updateStressedCharacter(stressCharacter);
  }

  /**
   * Add stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressRemoval(stressUpdate: StressUpdate) {
    const stressCharacter = this.stressStateManager.getStressedCharacter(
      stressUpdate
    );

    if (stressCharacter === null) {
      this.logger.error(
        'Tried to add stress for unknown character: ' + stressUpdate.name
      );
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);

    this.updateStressAmount(stressCharacter, stressUpdate);
    this.removeStresses(stressCharacter, diff);

    this.stressStateManager.updateStressedCharacter(stressCharacter);
  }

  private removeStresses(
    stressedCharacter: StressedCharacter,
    count: number
  ): StressedCharacter {
    this.logger.debug(
      'Removing ' + count + ' stresses from ' + stressedCharacter.name
    );
    
    for (let index = 0; index < count; index++) {
      if(stressedCharacter.stresses.length === 0) {
        break;
      }

      let stressedItem: StressItem = stressedCharacter.stresses.shift();
      stressedItem.undoEffect(stressedCharacter);
    }

    return stressedCharacter;
  }
  /**
   * Add {@link StressItems} to a character. Calls the doEffect on each and adds them
   * to the array of stresses
   *
   * @param stressedCharacter character to add StressItems for
   * @param count amount of StressItems to add
   */
  private addStresses(
    stressedCharacter: StressedCharacter,
    count: number
  ): StressedCharacter {
    this.logger.debug(
      'Adding ' + count + ' stresses to ' + stressedCharacter.name
    );
    const stressesToAdd = this.stressItemManager.getRandomStresses(count);

    stressesToAdd.forEach(stressToAdd => {
      stressToAdd.doEffect(stressedCharacter);
      stressedCharacter.stresses.push(stressToAdd);
    });

    return stressedCharacter;
  }

  /**
   * Add or remove stress amount to a stressedCharacter.
   *
   * @param stressedCharacter character to add stress to
   * @param stressUpdate obj containing stress amount to add/remove
   */
  private updateStressAmount(
    stressedCharacter: StressedCharacter,
    stressUpdate: StressUpdate
  ): StressedCharacter {
    stressedCharacter.stressValue = Math.min(stressedCharacter.stressValue += stressUpdate.amount, 0);
    this.logger.debug('Updated stress to new value: ' + stressedCharacter.stressValue + ' on character ' + stressedCharacter.name)
    return stressedCharacter;
  }

  /**
   * Calculate how many stress steps were added or removed from a character.
   *
   * @param stressedCharacter character to calculate stress steps for
   * @param stressUpdate obj containing stress added or removed
   */
  private getStressStepDifference(
    stressedCharacter: StressedCharacter,
    stressUpdate: StressUpdate
  ) {
    const oldStress = Math.floor(
      stressedCharacter.stressValue / this.stressModifier
    );

    const newStress = Math.floor(
      Math.min(stressedCharacter.stressValue + stressUpdate.amount, 0) / this.stressModifier
    );

    return newStress - oldStress;
  }
}
