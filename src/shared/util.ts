import { Logger } from './Logger';

export function findCharacterByName(name: string): Character | undefined {
  const objs = findObjs({
    _type: 'character',
    name: name
  });

  if (objs.length > 1) {
    Logger.getInstance().error(
      `Found more than 1 result for ${name}, aborting to ensure nothing goes wrong`
    );
    return undefined;
  }

  return objs.pop() as Character;
}

export function findAttributeByNameAndCharacterId(
  name: string,
  characterId: string
): Attribute | undefined {
  const objs = findObjs({
    _type: 'attribute',
    _characterid: characterId,
    name: name
  });

  if (objs.length > 1) {
    Logger.getInstance().error(
      `Found more than 1 result for ${name}, aborting to ensure nothing goes wrong`
    );
    return undefined;
  }

  return objs.pop() as Attribute;
}

export function updateNumericalPropertyWithValue(
  propertyName: string,
  characterName: string,
  value: number
) {
  const character = findCharacterByName(characterName);

  if (!character) {
    Logger.getInstance().error(`Could not find character with name ${characterName}`);
    return;
  }

  const property = findAttributeByNameAndCharacterId(propertyName, character.id);

  if (!property) {
    Logger.getInstance().error(
      `Could not find property with name ${propertyName} on character ${characterName}`
    );
    return;
  }

  Logger.getInstance().info(
    `Modifying property ${propertyName} on character ${characterName} with value ${value}`
  );

  const current = +property.get('current');
  property.setWithWorker('current', String(current + value));
}

export function getPlayerDisplayName(playerCharacter: PlayerCharacter): string {
  const player: Player | undefined = getObj('player', playerCharacter.id);

  if(!player){
    Logger.getInstance().error(`Could not find player with ID ${playerCharacter.id}`);
    return 'unknown sender';
  }

  return player.get('_displayname');
}

export function getTokenNameFromId(id: string): string | undefined {
  const graphicObj = getObj('graphic', id);
  
  if(graphicObj && graphicObj.get('_subtype') === 'token') {
    return graphicObj.get('name')
  }

  return;
}
