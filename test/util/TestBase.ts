import { ObjectHelper } from '../../src/shared/ObjectHelper';

const stressUpdateBase: StressUpdate = {
  characterId: 'uuid-charcter',
  playerId: 'uuid-player',
  name: 'Bolvar',
  amount: 0
};

const stressedCharacterBase: StressedCharacter = {
  characterId: 'uuid-charcter',
  playerId: 'uuid-player',
  name: 'Bolvar',
  stressValue: 0,
  stresses: []
};

const stressItemBase: StressItem = {
  id: 1,
  type: 'debuff',
  name: 'Stress Base',
  targetAttribute: 'attributeTarget',
  attributeModifier: -2
};

/**
 * Provide deep copies of bases to ensure tests don't get messed up by properties changing.
 */
export class TestBase {
  public static stressUpdateBase(): StressUpdate {
    return ObjectHelper.deepCopy<StressUpdate>(stressUpdateBase);
  }

  public static stressedCharacterBase(): StressedCharacter {
    return ObjectHelper.deepCopy<StressedCharacter>(stressedCharacterBase);
  }

  public static stressItemBase(): StressItem {
    return ObjectHelper.deepCopy<StressItem>(stressItemBase);
  }
}
