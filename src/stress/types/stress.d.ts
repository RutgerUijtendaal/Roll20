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
  name: string;
  added?: number;
  doEffect: (stressedCharacter: StressedCharacter) => void;
  undoEffect: (stressedCharacter: StressedCharacter) => void;
}

interface StressState {
  version: number,
  characters: StressedCharacter[]
}  
