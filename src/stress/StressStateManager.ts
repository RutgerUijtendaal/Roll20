import { Logger } from '../shared/Logger';
import { environment } from '../env';
import { StressAbilityCreator } from './StressAbilityCreator';

export class StressStateManager {
  stressAbilityCreator: StressAbilityCreator;
  logger: Logger;

  constructor(stressAbilityCreator: StressAbilityCreator) {
    this.stressAbilityCreator = stressAbilityCreator;
    this.logger = Logger.getInstance();
    this.logger.info('Initialize StressManager');

    if (environment === 'test') {
      this.logger.info('Starting fresh with stressManager');
      state.StressNS = null;
    }

    if (!state.StressNS) {
      this.initializeState();
    } else if(environment === 'test') {
      this.debugState();
    }
  }

  getState(): StressState {
    return state.StressNS;
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
        `Tried adding existing character to StressState: ${character.name}`
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
      `Added new character ${character.name} to StressState`
    );

    this.stressAbilityCreator.createStressAbilitiesOnCharacter(character);
  }

  updateStressedCharacter(stressedCharacter: StressedCharacter) {
    if (!this.characterExists(stressedCharacter)) {
      this.logger.error(
        `Attempted to update unknown character: ${stressedCharacter.name}`
      );
      return;
    }

    this.getState().characters[
      this.findCharacterIndex(stressedCharacter)
    ] = stressedCharacter;
  }

  /**
   * 
   * @param character 
   */
  getStressedCharacter(character: PlayerCharacter): StressedCharacter | undefined {
    if (!this.characterExists(character)) {
      return undefined;
    }

    return state.StressNS.characters[this.findCharacterIndex(character)];
  }

  private characterExists(character: PlayerCharacter): boolean {
    return this.findCharacterIndex(character) !== -1;
  }

  private findCharacterIndex(character: PlayerCharacter): number {
    const index = state.StressNS.characters.findIndex((_character: StressedCharacter) => {
      return (
        _character.id === character.id && _character.name === character.name
      );
    });

    return index;
  }

  private debugState() {
    this.getState().characters.forEach((char: StressedCharacter) => {
      this.logger.debug(
        `char: ${char.name} with stresses:`)

      char.stresses.forEach((stress: StressItem) => {
        this.logger.debug(
          `${stress.name}`
        )

        if(stress.mixin !== undefined) {
          this.logger.debug(`And mixin: ${stress.mixin.name}`)
        }
      })
    })
  }

  private initializeState() {
    this.logger.info('Creating new empty stress states');
    state.StressNS = {
      version: 1.0,
      characters: []
    };
  }
}
