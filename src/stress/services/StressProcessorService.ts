import { StressStateManager } from '../persistence/StressStateManager';
import { Logger } from '../../shared/Logger';
import { StressChatter } from '../util/StressChatter';
import { stressModifier } from '../../env';
import { StressAdditionService } from './StressAdditionService';
import { StressRemovalService } from './StressRemovalService';
import { StressFileWriter } from '../util/StressFileWriter';

export class StressProcessorService {
  stressModifier = stressModifier || 5;
  stressStateManager: StressStateManager;
  stressAdditionService: StressAdditionService;
  stressRemovalService: StressRemovalService;
  stressFileWriter: StressFileWriter;
  chatter: StressChatter;

  constructor(
    stressStateManager: StressStateManager,
    stressAdditionService: StressAdditionService,
    stressRemovalService: StressRemovalService,
    stressFileWriter: StressFileWriter,
    chatter: StressChatter
  ) {
    this.stressStateManager = stressStateManager;
    this.stressAdditionService = stressAdditionService;
    this.stressRemovalService = stressRemovalService;
    this.stressFileWriter = stressFileWriter;
    this.chatter = chatter;
  }

  /**
   * Add stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressAddition(stressUpdate: StressUpdate) {
    let stressCharacter = this.stressStateManager.getStressedCharacter(stressUpdate);

    if (stressCharacter === undefined) {
      Logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);
    stressCharacter = this.updateStressAmount(stressCharacter, stressUpdate);
    stressCharacter = this.stressAdditionService.addStresses(stressCharacter, diff);

    this.chatter.sendStressGainedWhisper(stressUpdate);
    this.stressStateManager.updateStressedCharacter(stressCharacter);
    this.stressFileWriter.updateStressNoteForStressedCharacter(stressCharacter);
  }

  /**
   * Remove stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  processStressRemoval(stressUpdate: StressUpdate) {
    let stressCharacter = this.stressStateManager.getStressedCharacter(stressUpdate);

    if (stressCharacter === undefined) {
      Logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    // If stress is already 0 we don't have to do anything
    if (stressCharacter.stressValue === 0) {
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);

    stressCharacter = this.updateStressAmount(stressCharacter, stressUpdate);
    stressCharacter = this.stressRemovalService.removeStresses(stressCharacter, diff);

    this.chatter.sendStressLostWhisper(stressUpdate);
    this.stressStateManager.updateStressedCharacter(stressCharacter);
    this.stressFileWriter.updateStressNoteForStressedCharacter(stressCharacter);
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
