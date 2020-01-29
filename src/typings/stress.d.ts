type StressType = 'debuff' | 'perseverence'

interface PlayerCharacter {
  characterId: string;
  playerId: string;
  name: string;
}

interface StressedCharacter extends PlayerCharacter {
  stressValue: number;
  stresses : StressItem[]
  perseverences: PerseverenceItem[]
}

interface StressUpdate extends PlayerCharacter {
  amount: number;
}

interface ItemBase {
  id: number;
  type: StressType;
  name: string;
  weight: number;
}

interface StressItem extends ItemBase {
  type: 'debuff'
  mixin?: StressItem;
  targetAttributes: string[];
  attributeModifier: number;
}

interface PerseverenceItem extends ItemBase {
  type: 'perseverence';
  uuid?: string;
  desc: string;
  targetAttributes?: string[];
  attributeModifier?: number;
}

interface StressState {
  version: number,
  characters: StressedCharacter[]
}  
