import { StressItemManager } from '../../items/StressItemManager';
import { StressChatter } from '../../util/StressChatter';
import { Roll20Util } from '../../../shared/Roll20Util';
import { StressProcessorService } from '../StressProcessorService';
import { Logger } from '../../../shared/Logger';

/**
 * StressPerseverenceRemovalService handles removing {@link PerseverenceItem}s from a
 * {@link StressedCharacter}.
 *
 * It is furthermore responsible for removing the effect on an item it removes.
 *
 * Note that because PerseverenceItems are unique in their effect it's basically a giant
 * switch statement over the item ids to call their effects.
 */
export class StressPerseverenceRemovalService {
  stressItemManager: StressItemManager;
  stressProcessorService: StressProcessorService;
  chatter: StressChatter;

  constructor(
    stressItemManager: StressItemManager,
    stressProcessorService: StressProcessorService,
    chatter: StressChatter
  ) {
    this.stressItemManager = stressItemManager;
    this.stressProcessorService = stressProcessorService;
    this.chatter = chatter;
  }

  /**
   * Remove a {@link PerseverenceItem} from a character. Undoes the effect and removes it from the
   * array of perseverences.
   *
   * The PerseverenceItem removed is based on a unique UUID that was generated when it was added.
   * 
   * If the perseverence can not be found this function returns quietly
   *
   * @param stressedCharacter Character to remove the item from
   * @param uuid Unique id of the perseverence item to remove
   */
  removePerseverenceItem(stressedCharacter: StressedCharacter, uuid: String): StressedCharacter {
    const index = stressedCharacter.perseverences.findIndex(
      perseverence => perseverence.uuid === uuid
    );

    if (index === -1) {
      Logger.error(
        `Couldn't find perseverence on character ${stressedCharacter.name} with id ${uuid}`
      );
      return stressedCharacter;
    }

    const perseverence = stressedCharacter.perseverences[index];
    stressedCharacter = this.undoPerseverenceEffect(stressedCharacter, perseverence, index);
    this.chatter.sendPerseverenceLostMessage(stressedCharacter, perseverence);

    return stressedCharacter;
  }

  private undoPerseverenceEffect(
    stressedCharacter: StressedCharacter,
    perseverence: PerseverenceItem,
    index: number
  ): StressedCharacter {
    switch (perseverence.id) {
      case 1: // Relax
        stressedCharacter = this.stressProcessorService.processStressLoss(
          {
            ...stressedCharacter,
            amount: -30,
            oldStressValue: stressedCharacter.stressValue
          },
        );
        stressedCharacter.perseverences.splice(index, 1);
        break;
      case 2: // Not Today
        stressedCharacter.perseverences.splice(index, 1);
        break;
      case 3: // Unstoppable
        stressedCharacter.perseverences.splice(index, 1);
        break;
      case 4: // Enough of this shit
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressedCharacter,
          perseverence,
          true
        );
        stressedCharacter.perseverences.splice(index, 1);
        break;
      case 5: // Focus
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressedCharacter,
          perseverence,
          true
        );
        stressedCharacter.perseverences.splice(index, 1);
        break;
      default:
        break;
    }

    return stressedCharacter;
  }
}
