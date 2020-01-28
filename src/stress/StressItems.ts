import { updateNumericalPropertyWithValue } from '../shared/util';

const stressStrength: StressItem = {
  id: 1,
  type: 'debuff',
  name: '-2 Strength',
  targetAttribute: 'strength',
  attributeModifier: -2
};

const stressCharisma: StressItem = {
  id: 2,
  type: 'debuff',
  name: '-2 Charisma',
  targetAttribute: 'charisma',
  attributeModifier: -2
};

const stressIntelligence: StressItem = {
  id: 3,
  type: 'debuff',
  name: '-2 Intelligence',
  targetAttribute: 'intelligence',
  attributeModifier: -2
};

const stressWisdom: StressItem = {
  id: 4,
  type: 'debuff',
  name: '-2 Wisdom',
  targetAttribute: 'wisdom',
  attributeModifier: -2
};

const stressDexterity: StressItem = {
  id: 5,
  type: 'debuff',
  name: '-2 Dexterity',
  targetAttribute: 'dexterity',
  attributeModifier: -2
};


export const stresses: StressItem[] = [
  stressStrength,
  stressCharisma,
  stressIntelligence,
  stressDexterity,
  stressWisdom
];
