import { Chatter } from '../../shared/Chatter';
import { Logger } from '../../shared/Logger';
import { StressItemManager } from '../items/StressItemManager';
import { updateNumericalPropertyWithValue } from '../../shared/util';

export class StressAdditionService {
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
   * Add {@link StressItem} to a character. Calls the doEffect on each and adds them
   * to the array of stresses.
   *
   * @param stressedCharacter character to add StressItems for
   * @param count amount of StressItems to add
   */
  addStresses(stressedCharacter: StressedCharacter, count: number): StressedCharacter {
    this.logger.info(`Adding ${count} stresses to ${stressedCharacter.name}`);
    const stressesToAdd = this.stressItemManager.getRandomStresses(count);

    stressesToAdd.forEach(stressToAdd => {
      if (this.isStressItemAlreadyPresent(stressToAdd, stressedCharacter)) {
        this.logger.debug(`Stress ${stressToAdd.name} already present on ${stressedCharacter.name}`)
        stressedCharacter = this.addDoubleStress(stressedCharacter);
      } else {
        stressedCharacter = this.addStress(stressedCharacter, stressToAdd);
      }
    });

    return stressedCharacter;
  }

  private addDoubleStress(stressedCharacter: StressedCharacter): StressedCharacter {
    this.logger.info(`Adding double stresses to ${stressedCharacter.name}`);
    const stressesToAdd = this.stressItemManager.getRandomStresses(2);

    // Add the normal stress first so there's always an empty mixin
    stressedCharacter = this.addStress(stressedCharacter, stressesToAdd[1]);

    // Mixin the first stress with the current oldest stress that has no mixin yet
    for (let index = 0; index < stressedCharacter.stresses.length; index++) {
      if (stressedCharacter.stresses[index].mixin === undefined) {
        this.logger.debug(`Added mixin on index ${index}`)
        stressedCharacter.stresses[index].mixin = (stressesToAdd[0] as StressItemBase);
        this.doStress(stressedCharacter, stressedCharacter.stresses[index].mixin!!)
        this.chatter.sendDoubleStressDebuffGainedMessage(
          stressedCharacter,
          stressedCharacter.stresses[index]
        );
        break;
      }
    }

    return stressedCharacter;
  }

  private addStress(
    stressedCharacter: StressedCharacter,
    stressItem: StressItem
  ): StressedCharacter {;
    this.doStress(stressedCharacter, stressItem)
    stressedCharacter.stresses.push(stressItem);
    this.chatter.sendStressDebuffGainedMessage(stressedCharacter, stressItem);
    return stressedCharacter;
  }

  private isStressItemAlreadyPresent(
    stressToAdd: StressItem,
    stressedCharacter: StressedCharacter
  ): boolean {
    return stressedCharacter.stresses.find(stress => stress.id === stressToAdd.id) !== undefined;
  }

  private doStress(stressedCharacter: StressedCharacter, stress: StressItemBase) {
    updateNumericalPropertyWithValue(stressedCharacter, stress);
  }
}