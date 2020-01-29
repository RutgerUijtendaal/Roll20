import { StressStateManager } from '../persistence/StressStateManager';
import { Logger } from '../../shared/Logger';
import { StressChatter } from '../util/StressChatter';
import { stressModifier } from '../../env';
import { StressAdditionService } from './StressAdditionService';
import { StressRemovalService } from './StressRemovalService';
import { StressFileWriter } from '../util/StressFileWriter';
import { StressItemManager } from '../items/StressItemManager';
import { StressPerseverenceService } from './StressPerseverenceService';

export class StressProcessorService {
  stressModifier = stressModifier || 5;
  stressStateManager: StressStateManager;
  stressAdditionService: StressAdditionService;
  stressRemovalService: StressRemovalService;
  stressPerseverenceService: StressPerseverenceService;
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
    this.stressPerseverenceService = new StressPerseverenceService(
      stressItemManager,
      this,
      chatter
    );
    this.chatter = chatter;
  }

  /**
   * Add stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressGain(stressUpdate: StressUpdate) {
    let stressedCharacter = this.stressStateManager.getStressedCharacter(stressUpdate);

    if (stressedCharacter === undefined) {
      Logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    const diff = this.getStressStepDifference(stressedCharacter, stressUpdate);
    stressedCharacter = this.updateStressAmount(stressedCharacter, stressUpdate);

    for (let index = 0; index < diff; index++) {
      if (this.stressItemManager.isPerseverence()) {
        stressedCharacter = this.stressPerseverenceService.addPerseverenceItem(stressedCharacter);
        stressedCharacter = this.updateStressAmount(stressedCharacter, {
          ...stressedCharacter,
          amount: -5
        })
      } else {
        stressedCharacter = this.stressAdditionService.addStressItem(stressedCharacter);
      }
    }
    
    this.stressStateManager.updateStressedCharacter(stressedCharacter);
    this.chatter.sendStressGainedWhisper(stressUpdate);
    this.stressFileWriter.updateStressNoteForStressedCharacter(stressedCharacter);
  }

  /**
   * Remove stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressLoss(stressUpdate: StressUpdate) {
    let stressedCharacter = this.stressStateManager.getStressedCharacter(stressUpdate);

    if (stressedCharacter === undefined) {
      Logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    // If stress is already 0 we don't have to do anything
    if (stressedCharacter.stressValue === 0) {
      return;
    }

    const diff = this.getStressStepDifference(stressedCharacter, stressUpdate);

    stressedCharacter = this.updateStressAmount(stressedCharacter, stressUpdate);
    stressedCharacter = this.stressRemovalService.removeStressItem(stressedCharacter, diff);

    this.chatter.sendStressLostWhisper(stressUpdate);
    this.stressStateManager.updateStressedCharacter(stressedCharacter);
    this.stressFileWriter.updateStressNoteForStressedCharacter(stressedCharacter);
  }

  processPerseverenceRemoval(playerCharacter: PlayerCharacter, uuid: string) {
    let stressedCharacter = this.stressStateManager.getStressedCharacter(playerCharacter);

    if (stressedCharacter === undefined) {
      Logger.error(`Tried to add stress for unknown character: ${playerCharacter.name}`);
      return;
    }

    stressedCharacter = this.stressPerseverenceService.removePerseverenceItem(stressedCharacter, uuid);
    this.stressStateManager.updateStressedCharacter(stressedCharacter);
    this.stressFileWriter.updateStressNoteForStressedCharacter(stressedCharacter);
  }

  private updateStressAmount(
    stressedCharacter: StressedCharacter,
    stressUpdate: StressUpdate
  ): StressedCharacter {
    stressedCharacter.stressValue = Math.max(
      (stressedCharacter.stressValue += stressUpdate.amount),
      0
    );
    Logger.debug(
      `Updated stress to new value: ${stressedCharacter.stressValue} on character ${stressedCharacter.name}`
    );
    return stressedCharacter;
  }

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
