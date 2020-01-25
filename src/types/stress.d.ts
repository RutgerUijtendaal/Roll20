interface StressManager {
  initialize: () => void;
  addNewStressedCharacter: (player: PlayerCharacter) => void;
  addStress: (stressUpdate: StressUpdate) => void;
}

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
  added: Date;
  doEffect: (playerId: string) => void;
  undoEffect: (playerId: string) => void;
}

interface StressState {
  version: number,
  characters: StressedCharacter[]
}  
