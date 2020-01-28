import { Logger } from '../../shared/Logger';
import { environment } from '../../env';
import { StressAbilityCreator } from '../util/StressAbilityCreator';

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
  addNewStressedCharacter(playerCharacter: PlayerCharacter) {
    if (this.characterExists(playerCharacter)) {
      this.logger.error(
        `Tried adding existing character to StressState: ${playerCharacter.name}`
      );
      return;
    }

    const stressedCharacter: StressedCharacter = {
      ...playerCharacter,
      stressValue: 0,
      stresses: []
    };

    state.StressNS.characters.push(stressedCharacter);

    this.logger.info(
      `Added new character ${playerCharacter.name} to StressState`
    );

    this.stressAbilityCreator.createStressAbilityOnCharacter(playerCharacter);
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
      return (
        _character.characterId === character.characterId
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
