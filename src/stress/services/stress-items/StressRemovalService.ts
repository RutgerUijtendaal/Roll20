import { Logger } from '../../../shared/Logger';
import { StressItemManager } from '../../items/StressItemManager';
import { Roll20Util } from '../../../shared/Roll20Util';
import { StressChatter } from '../../util/StressChatter';

/**
 * StressRemovalService is responsible for removing {@link StressItem}s from a character.
 * 
 * It removes the oldest (first in Array) stresses on a character based on the amount. When
 * removing it undoes any effect that a StressItem provided.
 */
export class StressRemovalService {
  stressItemManager: StressItemManager;
  chatter: StressChatter;

  constructor(
    stressItemManager: StressItemManager,
    chatter: StressChatter
  ) {
    this.stressItemManager = stressItemManager;
    this.chatter = chatter;
  } 

  /**
   * Remove {@link StressItem}s from a character. Undoes the effect on each and removes them
   * from the array of stresses.
   *
   * Removal is based on first in first out. If we somehow end up in a situation where more stresses
   * have to be removed than exist in the array this function returns silently.
   *
   * @param stressUpdate character to remove stresses from, and by what amount
   */
  removeStressItem(stressUpdate: StressUpdate): StressUpdate {
    Logger.info(`Removing stress from ${stressUpdate.name}`);
    let removedStress: StressItem | undefined = stressUpdate.stresses.shift();

    if (removedStress) {
      if(removedStress.mixin) {
        this.removeDoubleStress(stressUpdate, removedStress)
      } else {
        this.removeStress(stressUpdate, removedStress)
      }
    }

    return stressUpdate;
  }

  private removeDoubleStress(stressUpdate: StressUpdate, stress: StressItem) {
    if(!stress.mixin) {
      Logger.error(`Tried to double remove stress on a stress with no mixin`);
      return;
    }

    this.undoStress(stressUpdate, stress)
    this.undoStress(stressUpdate, stress.mixin)
    this.chatter.sendDoubleStressDebuffLostMessage(stressUpdate, stress);

  }

  private removeStress(stressedCharacter: StressedCharacter, stress: StressItem) {
    this.undoStress(stressedCharacter, stress)
    this.chatter.sendStressDebuffLostMessage(stressedCharacter, stress);
  }

  private undoStress(stressedCharacter: StressedCharacter, stress: StressItem) {
    Roll20Util.updateNumericalPropertiesWithValueFromStressItem(stressedCharacter, stress, true);
  }
}