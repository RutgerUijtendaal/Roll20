interface PlayerCharacter {
  id: string;
  name: string;
}

interface StressedCharacter extends PlayerCharacter {
  stressValue: number;
  stresses : StressItem[]
}

interface StressUpdate extends PlayerCharacter {
  amount: number;
}

interface StressItem {
  id: number;
  name: string;
  added?: number;
  targetAttribute: string;
  doEffect: (stressedCharacter: StressedCharacter) => void;
  undoEffect: (stressedCharacter: StressedCharacter) => void;
}

interface StressState {
  version: number,
  characters: StressedCharacter[]
}  
