import { Logger } from '../shared/Logger';
import { environment } from '../env';

export class StressStateManager {
  logger: Logger;
  state: StressState = state.StressNS;

  constructor() {
    this.logger = Logger.getInstance();
    this.logger.info('Initialize StressManager');

    if (environment === 'test') {
      this.logger.info('Starting fresh with stressManager');
      this.state = null;
    }

    if (!this.state) {
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

    this.state.characters.push(stressedCharacter);

    this.logger.info('Added new character ' + character.name + ' to StressState');
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


    this.state.characters[index].stressValue += stressUpdate.amount;
  }

  // Private
  characterExists(character: PlayerCharacter): boolean {
    return this.findCharacterIndex(character) !== -1;
  }

  // Private
  private findCharacterIndex(character: PlayerCharacter): number {
    const index = this.state.characters.findIndex(_character => {
      return (
        _character.id === character.id && _character.name === character.name
      );
    });

    return index;
  }

  // Private
  private initializeState() {
    this.logger.info('Creating new empty stress states');
    this.state = {
      version: 1.0,
      characters: []
    };
  }
}