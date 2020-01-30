type StressType = 'debuff' | 'perseverence'
type StressMessageType = 'Gained' | 'Lost'

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

interface StressUpdate extends StressedCharacter {
  amount: number;
  oldStressValue: number;
}

interface ItemBase {
  id: number;
  type: StressType;
  name: string;
  weight: number;
}

interface AttributeModifier {
  name: string,
  target: string,
  amount: number
}

interface StressItem extends ItemBase {
  type: 'debuff'
  mixin?: StressItem;
  targetAttributes: AttributeModifier[];
}

interface PerseverenceItem extends ItemBase {
  type: 'perseverence';
  uuid?: string;
  desc: string;
  targetAttributes?: AttributeModifier[];
}

interface StressState {
  version: number,
  characters: StressedCharacter[]
}  
