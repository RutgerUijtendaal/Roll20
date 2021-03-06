import { Logger } from '../../shared/Logger';
import { environment } from '../../env';

/**
 * StressStateManager handles persisting Stress data. 
 * 
 * An array of {@link StressedCharacter}s is persisted and can be queried against. 
 */
export class StressStateManager {
  constructor() {
    Logger.info('Initialize StressManager');

    if (environment === 'test') {
      Logger.info('Starting fresh with stressManager');
      state.StressNS = null;
    }

    if (!state.StressNS) {
      this.initializeState();
    } else if (environment === 'test') {
      this.debugState();
    }
  }

  /**
   * Returns the state object.
   */
  getState(): StressState {
    return state.StressNS;
  }

  /**
   * Add a new {@link StressedCharacter} to the state. Stress is initialized at 0.
   * If the character already exists in the state it is silently ignored.
   *
   * @param character new character to add. Properties acquired from chat user.
   */
  addNewStressedCharacter(playerCharacter: PlayerCharacter): StressedCharacter | undefined {
    if (this.characterExists(playerCharacter)) {
      Logger.error(`Tried adding existing character to StressState: ${playerCharacter.name}`);
      return;
    }

    const stressedCharacter: StressedCharacter = {
      ...playerCharacter,
      stressValue: 0,
      stresses: [],
      perseverences: []
    };

    state.StressNS.characters.push(stressedCharacter);

    Logger.info(`Added new character ${playerCharacter.name} to StressState`);

    return stressedCharacter;
  }

  /**
   * Updates an existing {@link StressedCharacter} with new values. Overwrites the whole
   * object. Updating is based on character id.
   *
   * If the character can't be found this function exits silently.
   *
   * @param stressedCharacter StressedCharacter to update.
   */
  updateStressedCharacter(stressedCharacter: StressedCharacter) {
    if (!this.characterExists(stressedCharacter)) {
      Logger.error(`Attempted to update unknown character: ${stressedCharacter.name}`);
      return;
    }

    this.getState().characters[this.findCharacterIndex(stressedCharacter)] = stressedCharacter;
  }

  /**
   * Get a {@link StressedCharacter} from the persisted state based on a {@link PlayerCharacter}.
   * Finding a character is based on character id.
   *
   * If no character can be found returns undefined instead.
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
      return _character.characterId === character.characterId;
    });

    return index;
  }

  private debugState() {
    this.getState().characters.forEach((char: StressedCharacter) => {
      Logger.debug(`char: ${char.name} with stresses:`);

      char.stresses.forEach((stress: StressItem) => {
        Logger.debug(`${stress.name}`);

        if (stress.mixin !== undefined) {
          Logger.debug(`And mixin: ${stress.mixin.name}`);
        }
      });
    });
  }

  private initializeState() {
    Logger.info('Creating new empty stress states');
    state.StressNS = {
      version: 1.0,
      characters: []
    };
  }
}
