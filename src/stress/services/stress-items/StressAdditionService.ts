import { Logger } from '../../../shared/Logger';
import { StressItemManager } from '../../items/StressItemManager';
import { Roll20Util } from '../../../shared/Roll20Util';
import { StressChatter } from '../../util/StressChatter';

/**
 * StressAdditionService is responsible for adding new {@link StressItem}s to a character.
 * 
 * It rolls for new items to add, handles their effect and adds them to a {@link StressedCharacter}s
 * list of stresses.
 */
export class StressAdditionService {
  stressItemManager: StressItemManager;
  chatter: StressChatter;

  constructor(stressItemManager: StressItemManager, chatter: StressChatter) {
    this.stressItemManager = stressItemManager;
    this.chatter = chatter;
  }

  /**
   * Add {@link StressItem} to a character. Handles the effect and adds it
   * to the array of stresses.
   * 
   * If a StressItem is already present, rather than adding it again, it rolls two new ones,
   * adds the first one to the current oldest Stress (making it a double) and the second one
   * to the end of the stress array (making it the newest).
   *
   * @param stressUpdate character to remove stresses from, and by what amount
   */
  addStressItem(stressUpdate: StressUpdate): StressUpdate {
    Logger.info(`Adding a stress to ${stressUpdate.name}`);
    const stressToAdd = this.stressItemManager.getRandomStress();

    if (this.isStressItemAlreadyPresent(stressToAdd, stressUpdate)) {
      Logger.debug(`Stress ${stressToAdd.name} already present on ${stressUpdate.name}`);
      stressUpdate = this.addDoubleStress(stressUpdate);
    } else {
      stressUpdate = this.addStress(stressUpdate, stressToAdd);
    }

    return stressUpdate;
  }

  private addDoubleStress(stressUpdate: StressUpdate): StressUpdate {
    Logger.info(`Adding double stresses to ${stressUpdate.name}`);

    // Add the normal stress first so there's always an empty mixin
    stressUpdate = this.addStress(stressUpdate, this.stressItemManager.getRandomStress());

    // Mixin the first stress with the current oldest stress that has no mixin yet
    for (let index = 0; index < stressUpdate.stresses.length; index++) {
      if (!stressUpdate.stresses[index].mixin) {
        stressUpdate.stresses[index].mixin = this.stressItemManager.getRandomStress();
        this.doStress(stressUpdate, stressUpdate.stresses[index].mixin!!);
        this.chatter.sendDoubleStressDebuffGainedMessage(
          stressUpdate,
          stressUpdate.stresses[index]
        );
        break;
      }
    }

    return stressUpdate;
  }

  private addStress(stressUpdate: StressUpdate, stressItem: StressItem): StressUpdate {
    this.doStress(stressUpdate, stressItem);
    stressUpdate.stresses.push(stressItem);
    this.chatter.sendStressDebuffGainedMessage(stressUpdate, stressItem);
    return stressUpdate;
  }

  private isStressItemAlreadyPresent(
    stressToAdd: StressItem,
    stressedCharacter: StressedCharacter
  ): boolean {
    return stressedCharacter.stresses.find(stress => stress.id === stressToAdd.id) !== undefined;
  }

  private doStress(stressedCharacter: StressedCharacter, stress: StressItem) {
    Roll20Util.updateNumericalPropertiesWithValueFromStressItem(stressedCharacter, stress);
  }
}
