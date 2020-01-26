import { StressItemManager } from './StressItemManager';
import { StressStateManager } from './StressStateManager';
import { Logger } from '../shared/Logger';
import { Chatter } from '../shared/Chatter';
import { stressModifier } from '../env';

export class StressProcessor {
  stressModifier = stressModifier || 5;
  logger: Logger;
  stressItemManager: StressItemManager;
  stressStateManager: StressStateManager;
  chatter: Chatter;

  constructor(
    stressItemManager: StressItemManager,
    stressStateManager: StressStateManager,
    chatter: Chatter
  ) {
    this.logger = Logger.getInstance();
    this.stressItemManager = stressItemManager;
    this.stressStateManager = stressStateManager;
    this.chatter = chatter;
  }

  // Used for testing;
  setLogger(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Add stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressAddition(stressUpdate: StressUpdate) {
    let stressCharacter = this.stressStateManager.getStressedCharacter(stressUpdate);

    if (stressCharacter === null) {
      this.logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);
    stressCharacter = this.updateStressAmount(stressCharacter, stressUpdate);
    stressCharacter = this.addStresses(stressCharacter, diff);

    this.stressStateManager.updateStressedCharacter(stressCharacter);
  }

  /**
   * Add stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressRemoval(stressUpdate: StressUpdate) {
    let stressCharacter = this.stressStateManager.getStressedCharacter(stressUpdate);

    if (stressCharacter === null) {
      this.logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);

    stressCharacter = this.updateStressAmount(stressCharacter, stressUpdate);
    stressCharacter = this.removeStresses(stressCharacter, diff);

    this.stressStateManager.updateStressedCharacter(stressCharacter);
  }

  /**
   * Remove {@link StressItem} from a character. Calls the undoEffect on each and removes them
   * from the array of stresses.
   *
   * Removal is based on first in first out. If we somehow end up in a situation where more stresses
   * have to be removed than exist in the array this function returns silently.
   *
   * @param stressedCharacter character to remove stresses from
   * @param count amount of stresses to remove
   */
  private removeStresses(stressedCharacter: StressedCharacter, count: number): StressedCharacter {
    this.logger.info(`Removing ${count} stresses from ${stressedCharacter.name}`);

    for (let index = 0; index < count; index++) {
      if (stressedCharacter.stresses.length === 0) {
        break;
      }

      let removedStress: StressItem | undefined = stressedCharacter.stresses.shift();

      if (removedStress) {
        removedStress.undoEffect(stressedCharacter);
        this.chatter.sendStressLostMessage(removedStress, stressedCharacter);
      }
    }

    return stressedCharacter;
  }

  /**
   * Add {@link StressItem} to a character. Calls the doEffect on each and adds them
   * to the array of stresses
   *
   * @param stressedCharacter character to add StressItems for
   * @param count amount of StressItems to add
   */
  private addStresses(stressedCharacter: StressedCharacter, count: number): StressedCharacter {
    this.logger.info(`Adding ${count} stresses from ${stressedCharacter.name}`);
    const stressesToAdd = this.stressItemManager.getRandomStresses(count);

    stressesToAdd.forEach(stressToAdd => {
      stressToAdd.doEffect(stressedCharacter);
      stressedCharacter.stresses.push(stressToAdd);
      this.chatter.sendStressGainedMessage(stressToAdd, stressedCharacter);
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
    stressedCharacter.stressValue = Math.max(
      (stressedCharacter.stressValue += stressUpdate.amount),
      0
    );
    this.logger.debug(
      `Updated stress to new value: ${stressedCharacter.stressValue} on character ${stressedCharacter.name}`
    );
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
    const oldStress = Math.floor(stressedCharacter.stressValue / this.stressModifier);

    const newStress = Math.floor(
      Math.max(stressedCharacter.stressValue + stressUpdate.amount, 0) / this.stressModifier
    );

    return Math.abs(newStress - oldStress);
  }
}
