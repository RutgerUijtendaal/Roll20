import { StressStateManager } from './StressStateManager';
import { Logger } from '../shared/Logger';
import { Chatter } from '../shared/Chatter';
import { stressModifier } from '../env';
import { StressAdditionService } from './StressAdditionService';
import { StressRemovalService } from './StressRemovalService';

export class StressProcessor {
  stressModifier = stressModifier || 5;
  logger: Logger;
  stressStateManager: StressStateManager;
  stressAdditionService: StressAdditionService;
  stressRemovalService: StressRemovalService;
  chatter: Chatter;

  constructor(
    stressStateManager: StressStateManager,
    stressAdditionService: StressAdditionService,
    stressRemovalService: StressRemovalService,
    chatter: Chatter
  ) {
    this.logger = Logger.getInstance();
    this.stressStateManager = stressStateManager;
    this.stressAdditionService = stressAdditionService;
    this.stressRemovalService = stressRemovalService;
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

    if (stressCharacter === undefined) {
      this.logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);
    stressCharacter = this.updateStressAmount(stressCharacter, stressUpdate);
    stressCharacter = this.stressAdditionService.addStresses(stressCharacter, diff);

    this.chatter.sendStressGainedWhisper(stressCharacter, stressUpdate.amount);
    this.stressStateManager.updateStressedCharacter(stressCharacter);
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
      this.logger.error(`Tried to add stress for unknown character: ${stressUpdate.name}`);
      return;
    }

    // If stress is already 0 we don't have to do anything
    if (stressCharacter.stressValue === 0) {
      return;
    }

    const diff = this.getStressStepDifference(stressCharacter, stressUpdate);

    stressCharacter = this.updateStressAmount(stressCharacter, stressUpdate);
    stressCharacter = this.stressRemovalService.removeStresses(stressCharacter, diff);

    this.chatter.sendStressLostWhisper(stressCharacter, stressUpdate.amount);
    this.stressStateManager.updateStressedCharacter(stressCharacter);
  }

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
