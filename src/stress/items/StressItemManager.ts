import { stresses } from './StressItems';
import { ObjectHelper } from '../../shared/ObjectHelper';

export class StressItemManager {
  stressItems: StressItem[];

  constructor() {
    this.stressItems = stresses;
  }

  /**
   * Return an array of a set amount of randomly selected {@link StressItem} from the available list.
   *
   * @param amount
   */
  getRandomStresses(amount: number): StressItem[] {
    const newStresses = new Array<StressItem>();

    for (let index = 0; index < amount; index++) {
      let stress = this.getRandomStress();
      newStresses.push(stress);
    }

    return newStresses;
  }

  private getRandomStress(): StressItem {
    // Have to make deep copies to make sure we're not constantly referencing the same obj.
    return ObjectHelper.deepCopy<StressItem>(this.stressItems[this.getRandomNumberForSize()]);
  }

  private getRandomNumberForSize() {
    return Math.floor(Math.random() * this.stressItems.length);
  }
}
