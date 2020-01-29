import { StressStateManager } from '../persistence/StressStateManager';
import { Logger } from '../../shared/Logger';
import { StressChatter } from '../util/StressChatter';
import { stressModifier } from '../../env';
import { StressAdditionService } from './stress-items/StressAdditionService';
import { StressRemovalService } from './stress-items/StressRemovalService';
import { StressFileWriter } from '../util/StressFileWriter';
import { StressItemManager } from '../items/StressItemManager';
import { StressPerseverenceRemovalService } from './perseverence-items/StressPerseverenceRemovalService';
import { StressPerseverenceAdditionService } from './perseverence-items/StressPerseverenceAdditionService';

/**
 * StressProcessorService is the entry point for handling new {@link StressUpdate}s.
 * 
 * This class holds reference to {@link StressAdditionService}, {@link StressRemovalService},
 * {@link StressPerseverenceAdditionService} and {@link StressPerseverenceRemovalService} and 
 * delegates to the correct one depending on Stress rolls and update amounts.
 */
export class StressProcessorService {
  stressModifier = stressModifier || 5;
  stressStateManager: StressStateManager;
  stressAdditionService: StressAdditionService;
  stressRemovalService: StressRemovalService;
  stressPerseverenceRemovalService: StressPerseverenceRemovalService;
  stressPerseverenceAdditionService: StressPerseverenceAdditionService;
  stressFileWriter: StressFileWriter;
  stressItemManager: StressItemManager;
  chatter: StressChatter;

  constructor(
    stressStateManager: StressStateManager,
    stressFileWriter: StressFileWriter,
    stressItemManager: StressItemManager,
    chatter: StressChatter
  ) {
    this.stressStateManager = stressStateManager;
    this.stressItemManager = stressItemManager;
    this.stressFileWriter = stressFileWriter;
    this.stressAdditionService = new StressAdditionService(stressItemManager, chatter);
    this.stressRemovalService = new StressRemovalService(stressItemManager, chatter);
    this.stressPerseverenceRemovalService = new StressPerseverenceRemovalService(
      stressItemManager,
      this,
      chatter
    );
    this.stressPerseverenceAdditionService = new StressPerseverenceAdditionService(
      stressItemManager,
      this,
      chatter
    );
    this.chatter = chatter;
  }

  /**
   * Add stress to a {@link StressedCharacter}. If Stress reaches a breakpoint (based on 
   * stressModifier) rolls are made for each breakpoint reached to determine if a character 
   * should get a Stress debuff or Perseverence buff. Depending on the roll it adds either.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressGain(stressUpdate: StressUpdate): StressUpdate {
    for (let index = 0; index < stressUpdate.amount; index++) {
      stressUpdate.stressValue += 1;
      if(stressUpdate.stressValue % stressModifier === 0) {
        if (this.stressItemManager.isPerseverence()) {
          stressUpdate.stressValue -= 5;
          stressUpdate.amount -= 5;
          stressUpdate = this.stressPerseverenceAdditionService.addPerseverenceItem(stressUpdate);
        } else {
          stressUpdate = this.stressAdditionService.addStressItem(stressUpdate);
        }
      }
    }

    return this.postProcessing(stressUpdate);
  }

  /**
   * Remove stress from a character. If Stress reaches a breakpoint (based on 
   * stressModifier) {@link StressItem} are removed from a character.
   * 
   * @param stressUpdate obj containing who to update stress for and by what amount.
   * @param internal optional. If true does not trigger a whisper to a player. Default false.
   */
  processStressLoss(stressUpdate: StressUpdate, internal=false): StressUpdate {
    // If stress is already 0 we don't have to do anything
    if (stressUpdate.stressValue === 0) {
      return stressUpdate;
    }

    for (let index = stressUpdate.amount; index < 0; index++) {
      stressUpdate.stressValue = Math.max((stressUpdate.stressValue - 1), 0)
      if(stressUpdate.stressValue % stressModifier === 0) {
        stressUpdate = this.stressRemovalService.removeStressItem(stressUpdate);
      }
    }

    return this.postProcessing(stressUpdate, internal);
  }

  /**
   * Remove a {@link PerseverenceItem} from a character. Item to remove is based on the
   * UUID.
   * 
   * @param stressedCharacter character to remove perseverence from.
   * @param uuid unique id of the perseverence to remove.
   */
  processPerseverenceRemoval(stressedCharacter: StressedCharacter, uuid: string) {
    stressedCharacter = this.stressPerseverenceRemovalService.removePerseverenceItem(
      stressedCharacter,
      uuid
    );

    this.postProcessing({
      ...stressedCharacter,
      amount: 0
    });
  }

  private postProcessing(stressUpdate: StressUpdate, internal=false): StressUpdate {
    if (stressUpdate.amount !== 0 && !internal) {
      this.chatter.sendStressChangedMessage(stressUpdate);
    }

    this.stressStateManager.updateStressedCharacter(stressUpdate);
    this.stressFileWriter.updateStressNoteForStressedCharacter(stressUpdate);

    return stressUpdate;
  }
}
