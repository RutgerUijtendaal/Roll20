import { findCharacterByName } from '../shared/util';
import { Logger } from '../shared/Logger';

export class StressAbilityCreator {
  /**
   * Create the stress buttons for a specified playerCharacter. Creates a +1 and -1 Stress button.
   *
   * @param playerCharacter playerCharacter to create the buttons for
   */
  createStressAbilitiesOnCharacter(playerCharacter: PlayerCharacter) {
    let character = findCharacterByName(playerCharacter.name);
    
    if (!character) {
      Logger.getInstance().error(
        `Aborting stress ability creation as 0 or more than 1 characters were found with name ${playerCharacter.name}`
      );
      return;
    }

    const abilityProperties: AbilityCreationProperties = {
      _characterid: character.id,
      name: 'Stress',
      description: 'Modify your stress',
      action: '!?{Add/Remove|Add,+|Subtract,-}stress ?{Amount|1}',
      istokenaction: true
    };

    createObj('ability', abilityProperties);
  }
}
