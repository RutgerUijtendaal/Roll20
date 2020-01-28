import { Logger } from './Logger';

export class Roll20Util {
   /**
   * Update the attributes of a character for each stress. If the attribute does not yet exist 
   * (which happens when it's the default value) it is created.
   * 
   * @param stressedCharacter character to modify attributes for.
   * @param stress {@link StressItem} list containg attributes to modify and by what amount.
   */
  static updateNumericalPropertiesWithValue(stressedCharacter: StressedCharacter, stress: StressItem) {
    stress.targetAttributes.forEach(targetAttribute => {
      Roll20Util.updateNumericalPropertyWithValue(stressedCharacter, targetAttribute, stress.attributeModifier);
    })
  }

  /**
   * Get the display name of a player by its id. Useful for whispering a player.
   * 
   * @param playerId playerId to get the display name for.
   */
  static getPlayerDisplayNameById(playerId: string): string {
    const player: Player | undefined = getObj('player', playerId);
    
    if (!player) {
      Logger.error(`Could not find player with ID ${playerId}`);
      return 'unknown sender';
    }

    return player.get('_displayname');
  }

  /**
   * Get the {@link Character} object associated with a token. This requires the token to 
   * have a default character that it represents. 
   * 
   * If the token or represents value don't exist, or if the id isn't a token, this function 
   * returns undefined.
   * 
   * @param id tokenId to get the associated character for.
   */
  static getCharacterFromTokenId(id: string): Character | undefined {
    const token = this.getGraphicTokenFromId(id);

    if (!token) {
      return;
    }

    const character = getObj('character', token.get('represents'));

    if (!character) {
      return;
    }

    return character;
  }

  static getAbilityOnCharacter(abilityName: string, characterId: string): Ability | undefined {
    const abilities = findObjs({
      _type: 'ability',
      _characterid: characterId,
      name: abilityName
    })

    if (abilities.length > 1) {
      Logger.error(
        `Found more than 1 ability for ${abilityName}, aborting to ensure nothing goes wrong`
      );
      return undefined;
    }

    return abilities.pop() as Ability;
  }

  private static getGraphicTokenFromId(id: string): Graphic | undefined {
    const graphicObj = getObj('graphic', id);

    if (graphicObj && graphicObj.get('_subtype') === 'token') {
      return graphicObj;
    }

    return;
  }

  private static updateNumericalPropertyWithValue(stressedCharacter: StressedCharacter, attributeName: string, amount: number) {
    const property = Roll20Util.findAttributeByNameAndCharacterId(
      attributeName,
      stressedCharacter.characterId
    );

    if (!property) {
      Logger.error(
        `Could not find property with name ${attributeName} on character ${stressedCharacter.name}, creating...`
      );
      Roll20Util.createPropertyWithValueZeroOnCharacter(stressedCharacter, attributeName);
      // Recursion woooo~
      Roll20Util.updateNumericalPropertyWithValue(stressedCharacter, attributeName, amount);
      return
    }

    Logger.info(
      `Modifying property ${attributeName} on character ${stressedCharacter.name} with value ${amount}`
    );

    const current = +property.get('current');
    property.setWithWorker('current', String(current + amount));
  }

  private static createPropertyWithValueZeroOnCharacter(stressedCharacter: StressedCharacter, attributeName: string) {
    const attribute: AttributeCreationProperties = {
      _characterid: stressedCharacter.characterId,
      current: '0',
      name: attributeName
    }
    
    createObj('attribute', attribute)
  }

  private static findAttributeByNameAndCharacterId(
    name: string,
    characterId: string
  ): Attribute | undefined {
    const attributes = findObjs({
      _type: 'attribute',
      _characterid: characterId,
      name: name
    });

    if (attributes.length > 1) {
      Logger.error(
        `Found more than 1 attribute result for ${name}, aborting to ensure nothing goes wrong`
      );
      return undefined;
    }

    return attributes.pop() as Attribute;
  }
}
