import { Logger } from '../shared/Logger';
import { environment } from '../env';
import { StressItemManager } from './StressItemManager';

export class StressStateManager {
  readonly stressModifier = 5;
  stressItemManager: StressItemManager;
  logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
    this.logger.info('Initialize StressManager');

    this.stressItemManager = new StressItemManager();

    if (environment === 'test') {
      this.logger.info('Starting fresh with stressManager');
      state.StressNS = null;
    }

    if (!state.StressNS) {
      this.initializeState();
    }
  }

  /**
   * Add a new {@link StressedCharacter} to the state. Stress is initialized at 0.
   * If the character already exists in the state it is silently ignored.
   *
   * @param character new character to add. Properties acquired from chat user.
   */
  addNewStressedCharacter(character: PlayerCharacter) {
    if (this.characterExists(character)) {
      this.logger.error(
        'Tried adding existing character to StressState: ' + character.name
      );
      return;
    }

    const stressedCharacter: StressedCharacter = {
      id: character.id,
      name: character.name,
      stressValue: 0,
      stresses: []
    };

    state.StressNS.characters.push(stressedCharacter);

    this.logger.info(
      'Added new character ' + character.name + ' to StressState'
    );
  }

  /**
   * Add stress to a character. If character is not currently registered this request is
   * discarded silently.
   *
   * @param stressUpdate obj containing who to update stress for and by what amount.
   */
  addStress(stressUpdate: StressUpdate) {
    const index = this.findCharacterIndex(stressUpdate);

    if (index === -1) {
      this.logger.error(
        'Tried to add stress for unknown character: ' + stressUpdate.name
      );
      return;
    }

    this.logger.debug(
      'Increasing stress by ' +
        stressUpdate.amount +
        ' for character: ' +
        stressUpdate.name
    );

    const oldStress =
      Math.floor(state.StressNS.characters[index].stressValue / this.stressModifier);
    state.StressNS.characters[index].stressValue += stressUpdate.amount;
    const newStress =
      Math.floor(state.StressNS.characters[index].stressValue / this.stressModifier);
    const diff = newStress - oldStress;

    if (diff > 0) {
      this.logger.info(
        'Adding' + diff + ' stresses to character: ' + stressUpdate.name
      );
    }

    const stressesToAdd = this.stressItemManager.getRandomStresses(diff);

    stressesToAdd.forEach(stressToAdd => {
      stressToAdd.doEffect(state.StressNS.characters[index])
    })
  }

  private characterExists(character: PlayerCharacter): boolean {
    return this.findCharacterIndex(character) !== -1;
  }

  private findCharacterIndex(character: PlayerCharacter): number {
    const index = state.StressNS.characters.findIndex(_character => {
      return (
        _character.id === character.id && _character.name === character.name
      );
    });

    return index;
  }

  private initializeState() {
    this.logger.info('Creating new empty stress states');
    state.StressNS = {
      version: 1.0,
      characters: []
    };
  }
}
