import { stresses } from './StressItems';
import { ObjectHelper } from '../../shared/ObjectHelper';
import { perseverences } from './StressPerseverenceItems';
import { Logger } from '../../shared/Logger';

export class StressItemManager {
  rollTableTotal: ItemBase[] = [];
  rollTableStress: StressItem[] = [];
  rollTablePerseverence: PerseverenceItem[] = [];

  constructor() {
    this.buildRollTable();
  }

  /**
   * Picks randomly from the entire table and returns if a {@link PerseverenceItem} was hit.
   */
  isPerseverence(): boolean {
    return (
      this.rollTableTotal[this.getRandomNumberForSize(this.rollTableTotal.length)].type ===
      'perseverence'
    );
  }

  /**
   * Return an array of a set amount of randomly selected {@link PerseverenceItem} from the available list.
   *
   * @param amount Number of PerseverenceItems to return
   */
  getRandomPerseverences(amount: number): PerseverenceItem[] {
    const newPerseverences = []

    for (let index = 0; index < amount; index++) {
      let perseverence = this.getRandomPerseverence();
      perseverence.uuid = this.randomUuid()
      newPerseverences.push(perseverence);
    }

    return newPerseverences;
  }

  /**
   * Return an array of a set amount of randomly selected {@link StressItem} from the available list.
   *
   * @param amount Number of StressItems to return
   */
  getRandomStresses(amount: number): StressItem[] {
    const newStresses = [];

    for (let index = 0; index < amount; index++) {
      let stress = this.getRandomStress();
      newStresses.push(stress);
    }

    return newStresses;
  }

  private buildRollTable() {
    Logger.info('Building roll table');
    stresses.forEach(stressItem => {
      for (let index = 0; index < stressItem.weight; index++) {
        this.rollTableTotal.push(stressItem);
        this.rollTableStress.push(stressItem);
      }
    });

    perseverences.forEach(perseverenceItem => {
      for (let index = 0; index < perseverenceItem.weight; index++) {
        this.rollTableTotal.push(perseverenceItem);
        this.rollTablePerseverence.push(perseverenceItem);
      }
    });

    Logger.debug(`Roll table size: ${this.rollTableTotal.length}`);
  }

  private getRandomStress(): StressItem {
    // Have to make deep copies to make sure we're not constantly referencing the same obj.
    return ObjectHelper.deepCopy<StressItem>(
      this.rollTableStress[this.getRandomNumberForSize(this.rollTableStress.length)]
    );
  }

  private getRandomPerseverence(): PerseverenceItem {
    // Have to make deep copies to make sure we're not constantly referencing the same obj.
    return ObjectHelper.deepCopy<PerseverenceItem>(
      this.rollTablePerseverence[this.getRandomNumberForSize(this.rollTablePerseverence.length)]
    );
  }

  private getRandomNumberForSize(size: number) {
    return Math.floor(Math.random() * size);
  }

  private randomUuid(): string {
      const uuid =  '_' + Math.random().toString(36).substr(2, 9);
      Logger.debug(`generated uuid ${uuid}`)
      return uuid;
  }
}

