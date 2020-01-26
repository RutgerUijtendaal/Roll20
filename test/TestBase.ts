import { ObjectHelper } from './ObjectHelper';

const stressUpdateBase: StressUpdate = {
  id: 'uuid-string',
  name: 'Bolvar',
  amount: 0
};

const stressedCharacterBase: StressedCharacter = {
  id: 'uuid-string',
  name: 'Bolvar',
  stressValue: 0,
  stresses: []
};

const stressItemBase: StressItem = {
  id: 1,
  name: 'Stress Base',
  targetAttribute: 'attributeTarget',
  doEffect: stressedCharacter => {},
  undoEffect: stressedCharacter => {}
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
