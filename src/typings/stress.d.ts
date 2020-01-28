type StressType = 'debuff' | 'perseverence'

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

interface StressItemBase {
  id: number;
  type: StressType;
  name: string;
  added?: number;
  targetAttribute: string;
  doEffect: (stressedCharacter: StressedCharacter) => void;
  undoEffect: (stressedCharacter: StressedCharacter) => void;
}

interface StressItem extends StressItemBase {
  mixin?: StressItem;
}

interface StressState {
  version: number,
  characters: StressedCharacter[]
}  
