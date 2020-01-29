import { stresses } from './StressItems';
import { ObjectHelper } from '../../shared/ObjectHelper';
import { perseverences } from './StressPerseverenceItems';
import { Logger } from '../../shared/Logger';

/**
 * StressItemManager is a utility class for getting {@link StressItem}s and
 * {@link PerseverenceItem}s. 
 * 
 * Because different items have different weights a rolltable is build from all 
 * available items, accounting for different weights, which is then rolled against.
 */
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
   * Returns a randomly selected {@link StressItem} from the available rolltable.
   */
  getRandomStress(): StressItem {
    // Have to make deep copies to make sure we're not constantly referencing the same obj.
    return ObjectHelper.deepCopy<StressItem>(
      this.rollTableStress[this.getRandomNumberForSize(this.rollTableStress.length)]
    );
  }

  /**
   * Returns a randomly selected {@link PerseverenceItem} from the available rolltable.
   * 
   * A UUID is added to the item, in order for it to be removable later without worrying about
   * removing duplicates.
   */
  getRandomPerseverence(): PerseverenceItem {
    // Have to make deep copies to make sure we're not constantly referencing the same obj.
    const perseverence: PerseverenceItem = ObjectHelper.deepCopy<PerseverenceItem>(
      this.rollTablePerseverence[this.getRandomNumberForSize(this.rollTablePerseverence.length)]
    );
    perseverence.uuid = this.randomUuid()
    return perseverence;
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


  private getRandomNumberForSize(size: number) {
    return randomInteger(size) - 1
  }

  private randomUuid(): string {
      const uuid =  '_' + Math.random().toString(36).substr(2, 9);
      Logger.debug(`generated uuid ${uuid}`)
      return uuid;
  }
}

