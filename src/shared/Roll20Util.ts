import { Logger } from './Logger';

/**
 * Roll20Util provides some often used helper functions for interface with Roll20
 */
export class Roll20Util {
  /**
   * Update the attributes of a character for a {@link StressItem}. If the attribute does not yet exist
   * (which happens when it's the default value) it is created.
   *
   * @param playerCharacter character to modify attributes for.
   * @param stress item containing attributes to modify and by what amount.
   */
  static updateNumericalPropertiesWithValueFromStressItem(
    playerCharacter: PlayerCharacter,
    stress: StressItem,
    reverse=false
  ) {
    stress.targetAttributes.forEach(targetAttribute => {
      if(reverse) {
        targetAttribute.amount *= -1;
      }

      Roll20Util.updateNumericalPropertyWithValue(
        playerCharacter,
        targetAttribute.target,
        targetAttribute.amount
      );
    });
  }

  /**
   * Update the attributes of a character for each {@link PerseverenceItem}. If the attribute does not yet exist
   * (which happens when it's the default value) it is created.
   *
   * @param playerCharacter character to modify attributes for.
   * @param perseverence item containing attributes to modify and by what amount.
   */
  static updateNumericalPropertiesWithValueFromPerseverenceItem(
    playerCharacter: PlayerCharacter,
    perseverence: PerseverenceItem,
    reverse=false
  ) {
    if(perseverence.targetAttributes === undefined) {
      return;
    }

    perseverence.targetAttributes.forEach(targetAttribute => {
      if(reverse) {
        targetAttribute.amount *= -1;
      }
      Roll20Util.updateNumericalPropertyWithValue(
        playerCharacter,
        targetAttribute.target,
        targetAttribute.amount 
      );
    });
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

  /**
   * Get a {@link Handout} on a player by its name. All handouts with this name are
   * retrieved and then filtered down by playerId. If more than one handout still remain
   * this function returns undefined.
   * 
   * @param handoutName name of the handout
   * @param playerId player to get the handout for.
   */
  static getHandoutOnPlayer(handoutName: string, playerId: string): Handout | undefined {
    let handouts = findObjs({
      _type: 'handout',
      name: handoutName
    }) as Handout[];

    if (handouts.length === 0) {
      return;
    }

    handouts = handouts.filter(handout => {
      return handout.get('inplayerjournals').indexOf(playerId) != -1;
    });

    if(handouts.length > 1) {
      Logger.error(
        `Found more than 1 ability for ${handoutName}, aborting to ensure nothing goes wrong`
      );
      return;
    }

    return handouts.pop();
  }

  /**
   * Get a list of {@link Handout}s with a specific name. This is non player specific
   * and returns all handouts found with this name.
   * 
   * @param handoutName name of the handout to find.
   */
  static getHandoutsByName(handoutName: string): Handout[] | undefined {
    let handouts = findObjs({
      _type: 'handout',
      name: handoutName
    }) as Handout[];

    if (handouts.length === 0) {
      return;
    }

    return handouts;
  }

  /**
   * Get an ability on a specified character by name. If more tha one ability with this name
   * exists, or no ability can be found this function returns undefined.
   * 
   * @param abilityName name of the ability to get.
   * @param characterId id of the character to get the ability from.
   */
  static getAbilityOnCharacter(abilityName: string, characterId: string): Ability | undefined {
    const abilities = findObjs({
      _type: 'ability',
      _characterid: characterId,
      name: abilityName
    }) as Ability[];

    if (abilities.length > 1) {
      Logger.error(
        `Found more than 1 ability for ${abilityName}, aborting to ensure nothing goes wrong`
      );
      return undefined;
    }

    return abilities.pop();
  }

  private static getGraphicTokenFromId(id: string): Graphic | undefined {
    const graphicObj = getObj('graphic', id);

    if (graphicObj && graphicObj.get('_subtype') === 'token') {
      return graphicObj;
    }

    return;
  }

  private static updateNumericalPropertyWithValue(
    playerCharacter: PlayerCharacter,
    attributeName: string,
    amount: number
  ) {
    const property = Roll20Util.findAttributeByNameAndCharacterId(
      attributeName,
      playerCharacter.characterId
    );

    if (!property) {
      Logger.error(
        `Could not find property with name ${attributeName} on character ${playerCharacter.name}, creating...`
      );
      Roll20Util.createPropertyWithValueZeroOnCharacter(playerCharacter, attributeName);
      // Recursion woooo~
      Roll20Util.updateNumericalPropertyWithValue(playerCharacter, attributeName, amount);
      return;
    }

    Logger.info(
      `Modifying property ${attributeName} on character ${playerCharacter.name} with value ${amount}`
    );

    const current = +property.get('current');
    property.setWithWorker('current', String(current + amount));
  }

  private static createPropertyWithValueZeroOnCharacter(
    playerCharacter: PlayerCharacter,
    attributeName: string
  ) {
    const attribute: AttributeCreationProperties = {
      _characterid: playerCharacter.characterId,
      current: '0',
      name: attributeName
    };

    createObj('attribute', attribute);
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
