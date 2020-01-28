type StressType = 'debuff' | 'perseverence'

interface PlayerCharacter {
  characterId: string;
  playerId: string;
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
  weight: number;
  targetAttributes: string[];
  attributeModifier: number;
}

interface StressItem extends StressItemBase {
  mixin?: StressItemBase;
}

interface StressState {
  version: number,
  characters: StressedCharacter[]
}  
