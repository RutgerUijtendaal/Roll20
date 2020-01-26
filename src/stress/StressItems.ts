import { Logger } from '../shared/Logger';

const stressStrenght: StressItem = {
  name: '-2 Strenght',
  doEffect: (stressedCharacter) => {
    Logger.getInstance().info('-2 Strenght on: ' + stressedCharacter.name);
  },
  undoEffect: (stressedCharacter) => {
    Logger.getInstance().info('+2 Strenght on: ' + stressedCharacter.name);
  }
};

const stressCharisma: StressItem = {
  name: '-2 Charisma',
  doEffect: (stressedCharacter) => {
    Logger.getInstance().info('-2 Charisma on: ' + stressedCharacter.name);
  },
  undoEffect: (stressedCharacter) => {
    Logger.getInstance().info('+2 Charisma on: ' + stressedCharacter.name);
  }
};

export const stresses: StressItem[] = [stressStrenght, stressCharisma];
 