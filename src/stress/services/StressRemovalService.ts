import { Chatter } from '../../shared/Chatter';
import { Logger } from '../../shared/Logger';
import { StressItemManager } from '../items/StressItemManager';
import { updateNumericalPropertyWithValue } from '../../shared/util';

export class StressRemovalService {
  stressItemManager: StressItemManager;
  chatter: Chatter;
  logger: Logger;

  constructor(
    stressItemManager: StressItemManager,
    chatter: Chatter
  ) {
    this.logger = Logger.getInstance();
    this.stressItemManager = stressItemManager;
    this.chatter = chatter;
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
  removeStresses(stressedCharacter: StressedCharacter, count: number): StressedCharacter {
    this.logger.info(`Removing ${count} stresses from ${stressedCharacter.name}`);

    for (let index = 0; index < count; index++) {
      if (stressedCharacter.stresses.length === 0) {
        break;
      }

      let removedStress: StressItem | undefined = stressedCharacter.stresses.shift();

      if (removedStress) {
        if(removedStress.mixin !== undefined) {
          this.removeDoubleStress(stressedCharacter, removedStress)
        } else {
          this.removeStress(stressedCharacter, removedStress)
        }
      }
    }

    return stressedCharacter;
  }

  private removeDoubleStress(stressedCharacter: StressedCharacter, stress: StressItem) {
    if(stress.mixin === undefined) {
      this.logger.error(`Tried to double remove stress on a stress with no mixin`);
      return;
    }

    this.undoStress(stressedCharacter, stress)
    this.undoStress(stressedCharacter, stress.mixin)
    this.chatter.sendDoubleStressDebuffLostMessage(stressedCharacter, stress);

  }

  private removeStress(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.undoStress(stressedCharacter, stress)
    this.chatter.sendStressDebuffLostMessage(stressedCharacter, stress);
  }

  private undoStress(stressedCharacter: StressedCharacter, stress: StressItemBase) {
    stress.attributeModifier = stress.attributeModifier * -1
    updateNumericalPropertyWithValue(stressedCharacter, stress);
  }
}