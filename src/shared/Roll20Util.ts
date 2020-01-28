import { Logger } from './Logger';

export class Roll20Util {
  static updateNumericalPropertyWithValue(stressedCharacter: StressedCharacter, stress: StressItem) {
    const property = this.findAttributeByNameAndCharacterId(
      stress.targetAttribute,
      stressedCharacter.characterId
    );

    if (!property) {
      Logger.error(
        `Could not find property with name ${stress.targetAttribute} on character ${stressedCharacter.name}`
      );
      return;
    }

    Logger.info(
      `Modifying property ${stress.targetAttribute} on character ${stressedCharacter.characterId} with value ${stress.attributeModifier}`
    );

    const current = +property.get('current');
    property.setWithWorker('current', String(current + stress.attributeModifier));
  }

  static getPlayerDisplayNameById(playerId: string): string {
    const player: Player | undefined = getObj('player', playerId);

    if (!player) {
      Logger.error(`Could not find player with ID ${playerId}`);
      return 'unknown sender';
    }

    return player.get('_displayname');
  }

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

  private static getGraphicTokenFromId(id: string): Graphic | undefined {
    const graphicObj = getObj('graphic', id);

    if (graphicObj && graphicObj.get('_subtype') === 'token') {
      return graphicObj;
    }

    return;
  }

  private static findAttributeByNameAndCharacterId(
    name: string,
    characterId: string
  ): Attribute | undefined {
    const objs = findObjs({
      _type: 'attribute',
      _characterid: characterId,
      name: name
    });

    if (objs.length > 1) {
      Logger.error(
        `Found more than 1 result for ${name}, aborting to ensure nothing goes wrong`
      );
      return undefined;
    }

    return objs.pop() as Attribute;
  }
}
