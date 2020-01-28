import { Logger } from '../../shared/Logger';
import { Roll20Util } from '../../shared/Roll20Util';

export class StressAbilityCreator {
  /**
   * Create the stress buttons for a specified playerCharacter. Creates a +1 and -1 Stress button.
   *
   * @param playerCharacter playerCharacter to create the buttons for
   */
  createStressAbilityOnCharacter(playerCharacter: PlayerCharacter) {
    if(this.isStressAbilityPresent(playerCharacter)) {
      Logger.debug('Stress Ability already present')
      return
    }
    Logger.info(`Creating Stress ability on ${playerCharacter.name}`);

    const abilityProperties: AbilityCreationProperties = {
      _characterid: playerCharacter.characterId,
      name: 'Stress',
      description: 'Modify your stress',
      action: '!+-stress ?{Amount|0}',
      istokenaction: true
    };

    createObj('ability', abilityProperties);
  }

  private isStressAbilityPresent(playerCharacter: PlayerCharacter): boolean {
    return Roll20Util.getAbilityOnCharacter('Stress', playerCharacter.characterId) !== undefined;
  }
}
