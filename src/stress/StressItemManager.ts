import { stresses } from "./StressItems";

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
    return this.stressItems[this.getRandomNumberForSize()]
  }

  private getRandomNumberForSize() {
    return Math.floor(Math.random() * this.stressItems.length);
  }
}