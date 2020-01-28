import { updateNumericalPropertyWithValue } from '../shared/util';

const stressStrength: StressItem = {
  id: 1,
  type: 'debuff',
  name: '-2 Strength',
  targetAttribute: 'strength',
  doEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('strength', stressedCharacter.name, -2);
  },
  undoEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('strength', stressedCharacter.name, 2);
  }
};

const stressCharisma: StressItem = {
  id: 2,
  type: 'debuff',
  name: '-2 Charisma',
  targetAttribute: 'charisma',
  doEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('charisma', stressedCharacter.name, -2);
  },
  undoEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('charisma', stressedCharacter.name, 2);
  }
};

const stressIntelligence: StressItem = {
  id: 3,
  type: 'debuff',
  name: '-2 Intelligence',
  targetAttribute: 'intelligence',
  doEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('intelligence', stressedCharacter.name, -2);
  },
  undoEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('intelligence', stressedCharacter.name, 2);
  }
};

const stressWisdom: StressItem = {
  id: 4,
  type: 'debuff',
  name: '-2 Wisdom',
  targetAttribute: 'wisdom',
  doEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('wisdom', stressedCharacter.name, -2);
  },
  undoEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('wisdom', stressedCharacter.name, 2);
  }
};

const stressDexterity: StressItem = {
  id: 5,
  type: 'debuff',
  name: '-2 Dexterity',
  targetAttribute: 'dexterity',
  doEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('dexterity', stressedCharacter.name, -2);
  },
  undoEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('dexterity', stressedCharacter.name, 2);
  }
};


export const stresses: StressItem[] = [
  stressStrength,
  stressCharisma,
  stressIntelligence,
  stressDexterity,
  stressWisdom
];
