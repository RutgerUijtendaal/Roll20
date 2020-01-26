import { updateNumericalPropertyWithValue } from '../shared/util';

const stressStrength: StressItem = {
  id: 1,
  name: '-2 strength',
  targetAttribute: 'strength',
  doEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('strength', stressedCharacter.name, -2);
  },
  undoEffect: stressedCharacter => {
    updateNumericalPropertyWithValue('strength', stressedCharacter.name, 2);
  }
};

export const stresses: StressItem[] = [stressStrength];
