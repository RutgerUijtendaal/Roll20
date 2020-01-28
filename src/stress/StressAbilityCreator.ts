import { Logger } from '../shared/Logger';

export class StressAbilityCreator {
  /**
   * Create the stress buttons for a specified playerCharacter. Creates a +1 and -1 Stress button.
   *
   * @param playerCharacter playerCharacter to create the buttons for
   */
  createStressAbilityOnCharacter(playerCharacter: PlayerCharacter) {
    Logger.getInstance().info(`Creating Stress ability on ${playerCharacter.name}`);
    const abilityProperties: AbilityCreationProperties = {
      _characterid: playerCharacter.characterId,
      name: 'Stress',
      description: 'Modify your stress',
      action: '!?{Add/Remove|Add,+|Subtract,-}stress ?{Amount|1}',
      istokenaction: true
    };

    createObj('ability', abilityProperties);
  }
}
