var stressManager =
  stressManager ||
  (function(): StressManager {
    var _state: StressState = state.StressNS;
    var _stressStepSize = 5;

    /**
     * Initialize the Stress state. This function is called automatically at load and does
     * have to be manually called.
     *
     * If the state does not already exist initialize an empty new state. Else do nothing.
     *
     * If env is set to 'test' clear the previous state and create an empty new one.
     */
    function initialize() {
      logger.info('Initialize StressManager');

      if (environment === 'test') {
        logger.info('Starting fresh with stressManager');
        _state = null;
      }

      if (!_state) {
        initializeState();
      }
    }

    /**
     * Add a new {@link StressedCharacter} to the state. Stress is initialized at 0.
     * If the character already exists in the state it is silently ignored.
     *
     * @param character new character to add. Properties acquired from chat user.
     */
    function addNewStressedCharacter(character: PlayerCharacter) {
      if (characterExists(character)) {
        logger.error(
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

      _state.characters.push(stressedCharacter);

      logger.info('Added new character ' + character.name + ' to StressState');
    }

    /**
     * Add stress to a character. If character is not currently registered this request is
     * discarded silently.
     *
     * @param stressUpdate obj containing who to update stress for and by what amount.
     */
    function addStress(stressUpdate: StressUpdate) {
      const index = findCharacterIndex(stressUpdate);

      if (index === -1) {
        logger.error(
          'Tried to add stress for unknown character: ' + stressUpdate.name
        );
        return;
      }

      logger.debug(
        'Increasing stress by ' +
          stressUpdate.amount +
          ' for character: ' +
          stressUpdate.name
      );


      _state.characters[index].stressValue += stressUpdate.amount;
    }

    // Private
    function characterExists(character: PlayerCharacter): boolean {
      return findCharacterIndex(character) !== -1;
    }

    // Private
    function findCharacterIndex(character: PlayerCharacter): number {
      const index = _state.characters.findIndex(_character => {
        return (
          _character.id === character.id && _character.name === character.name
        );
      });

      return index;
    }

    // Private
    function initializeState() {
      logger.info('Creating new empty stress states');
      _state = {
        version: 1.0,
        characters: []
      };
    }

    return {
      initialize: initialize,
      addNewStressedCharacter: addNewStressedCharacter,
      addStress: addStress
    };
  })();

stressManager.initialize();
