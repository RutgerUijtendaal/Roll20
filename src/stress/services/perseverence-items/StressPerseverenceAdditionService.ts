import { StressItemManager } from '../../items/StressItemManager';
import { StressChatter } from '../../util/StressChatter';
import { Roll20Util } from '../../../shared/Roll20Util';
import { StressProcessorService } from '../StressProcessorService';

/**
 * StressPerseverenceAdditionService handles adding new {@link PerseverenceItems}
 * to a {@link StressedCharacter}.
 *
 * It is furthermore responsible for calling the effect on an item it adds.
 *
 * Note that because PerseverenceItems are unique in their effect it's basically a giant
 * switch statement over the item ids to call their effects.
 */
export class StressPerseverenceAdditionService {
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
   * Adds a randomly selected{@link PerseverenceItem} to a Character.
   *
   * Also handles the effect of the item.
   *
   * @param stressUpdate
   */
  addPerseverenceItem(stressUpdate: StressUpdate): StressUpdate {
    const perseverence = this.stressItemManager.getRandomPerseverence();

    stressUpdate = this.doPerseverenceEffect(stressUpdate, perseverence);
    this.chatter.sendPerseverenceGainedMessage(stressUpdate, perseverence);

    return stressUpdate;
  }

  private doPerseverenceEffect(
    stressUpdate: StressUpdate,
    perseverence: PerseverenceItem
  ): StressUpdate {
    switch (perseverence.id) {
      case 1: // Relax
        this.stressProcessorService.processStressLoss(
          {
            ...stressUpdate,
            amount: -30
          },
          true
        );
        stressUpdate.amount -= 30;
        stressUpdate.stressValue = Math.max(stressUpdate.stressValue - 30, 0);
        break;
      case 2: // Not Today
        stressUpdate.perseverences.push(perseverence);
        break;
      case 3: // Unstoppable
        stressUpdate.perseverences.push(perseverence);
        break;
      case 4: // Enough of this shit
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressUpdate,
          perseverence
        );
        stressUpdate.perseverences.push(perseverence);
        break;
      case 5: // Focus
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressUpdate,
          perseverence
        );
        stressUpdate.perseverences.push(perseverence);
        break;
      default:
        break;
    }

    return stressUpdate;
  }
}
