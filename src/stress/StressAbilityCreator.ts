import { findCharacterByName } from '../shared/util';
import { Logger } from '../shared/Logger';

export class StressAbilityCreator {
  /**
   * Create the stress buttons for a specified playerCharacter. Creates a +1 and -1 Stress button.
   *
   * @param playerCharacter playerCharacter to create the buttons for
   */
  createStressAbilitiesOnCharacter(playerCharacter: PlayerCharacter) {
    this.createRemoveStressAbilityOnCharacter(playerCharacter);
    this.createAddStressAbilityOnCharacter(playerCharacter);
  }

  private createRemoveStressAbilityOnCharacter(playerCharacter: PlayerCharacter) {
    let character = findCharacterByName(playerCharacter.name);
    
    if (!character) {
      Logger.getInstance().error(
        `Aborting stress ability creation as 0 or more than 1 characters were found with name ${playerCharacter.name}`
      );
      return;
    }

    const abilityProperties: AbilityCreationProperties = {
      _characterid: character.id,
      name: '-1 stress',
      description: 'Remove 1 stress',
      action: '!-stress 1',
      istokenaction: true
    };

    createObj('ability', abilityProperties);
  }

  private createAddStressAbilityOnCharacter(playerCharacter: PlayerCharacter) {
    const character = findCharacterByName(playerCharacter.name);

    if (!character) {
      Logger.getInstance().error(
        `Aborting stress ability creation as 0 or more than 1 characters were found with name ${playerCharacter.name}`
      );
      return;
    }

    const abilityProperties: AbilityCreationProperties = {
      _characterid: character.id,
      name: '+1 stress',
      description: 'Add 1 stress',
      action: '!+stress 1',
      istokenaction: true
    };

    createObj('ability', abilityProperties);
  }
}
