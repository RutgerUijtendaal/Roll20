import { Logger } from './Logger';

export function findCharacterIdByName(name: string): Character {
  const objs = findObjs({
    _type: 'character',
    name: name
  });
  Logger.getInstance().debug(`found: ${objs.length} characters for name ${name}`);
  return objs.pop() as Character;
}

export function findAttributeByNameAndCharacterId(name: string, characterId: string): Attribute {
  const objs = findObjs({
    _type: 'attribute',
    _characterid: characterId,
    name: name
  });
  Logger.getInstance().debug(`found: ${objs.length} attribute for name ${name}`);
  return objs.pop() as Attribute;
}

export function updateNumericalPropertyWithValue(
  propertyName: string,
  characterName: string,
  value: number
) {
  const character = findCharacterIdByName(characterName);

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
