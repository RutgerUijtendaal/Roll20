import { stresses } from "./StressItems";
import { ObjectHelper } from '../../test/ObjectHelper';

export class StressItemManager {
  stressItems: StressItem[]

  constructor() {
    this.stressItems = stresses;
  }

  getRandomStresses(amount : number): StressItem[] {
    const newStresses = new Array<StressItem>();

    for (let index = 0; index < amount; index++) {
      let stress = this.getRandomStress();
      stress.added = Date.now();
      newStresses.push(stress);
    }
    
    return newStresses;
  }

  private getRandomStress(): StressItem {
    return ObjectHelper.deepCopy<StressItem>(this.stressItems[this.getRandomNumberForSize()])
  }

  private getRandomNumberForSize() {
    return Math.floor(Math.random() * this.stressItems.length);
  }
}