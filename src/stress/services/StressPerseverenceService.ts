import { StressItemManager } from '../items/StressItemManager';
import { StressChatter } from '../util/StressChatter';
import { StressFileWriter } from '../util/StressFileWriter';
import { Roll20Util } from '../../shared/Roll20Util';
import { StressProcessorService } from './StressProcessorService';
import { perseverences } from '../items/StressPerseverenceItems';
import { Logger } from '../../shared/Logger';

export class StressPerseverenceService {
  stressItemManager: StressItemManager;
  stressProcessorService: StressProcessorService;
  chatter: StressChatter;

  constructor(
    stressItemManager: StressItemManager,
    stressProcessorService: StressProcessorService,
    chatter: StressChatter
  ) {
    this.stressItemManager = stressItemManager;
    this.stressProcessorService = stressProcessorService;
    this.chatter = chatter;
  }

  addPerseverenceItem(stressedCharacter: StressedCharacter): StressedCharacter {
    const perseverence = this.stressItemManager.getRandomPerseverences(1)[0];

    stressedCharacter = this.doPerseverenceEffect(stressedCharacter, perseverence);
    this.chatter.sendPerseverenceGainedMessage(stressedCharacter, perseverence);

    return stressedCharacter;
  }

  removePerseverenceItem(
    stressedCharacter: StressedCharacter,
    uuid: String
  ): StressedCharacter {
    const index = stressedCharacter.perseverences.findIndex(
      perseverence => perseverence.uuid === uuid
    );

    if (index === -1) {
      Logger.error(`Couldn't find perseverence on character ${stressedCharacter.name} with id ${uuid}`)
      return stressedCharacter;
    }

    const perseverence = stressedCharacter.perseverences[index];
    stressedCharacter = this.undoPerseverenceEffect(stressedCharacter, perseverence, index);
    this.chatter.sendPerseverenceLostMessage(stressedCharacter, perseverence);

    return stressedCharacter;
  }

  private doPerseverenceEffect(
    stressedCharacter: StressedCharacter,
    perseverence: PerseverenceItem
  ): StressedCharacter {
    switch (perseverence.id) {
      case 1: // Relax
        this.stressProcessorService.processStressLoss({
          ...stressedCharacter,
          amount: -30
        });
        break;
      case 2: // Not Today
        stressedCharacter.perseverences.push(perseverence);
        break;
      case 3: // Unstoppable
        stressedCharacter.perseverences.push(perseverence);
        break;
      case 4: // Enough of this shit
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressedCharacter,
          perseverence
        );
        stressedCharacter.perseverences.push(perseverence);
        break;
      case 5: // Focus
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressedCharacter,
          perseverence
        );
        stressedCharacter.perseverences.push(perseverence);
        break;
      default:
        break;
    }

    return stressedCharacter;
  }

  private undoPerseverenceEffect(
    stressedCharacter: StressedCharacter,
    perseverence: PerseverenceItem,
    index: number
  ): StressedCharacter {
    switch (perseverence.id) {
      case 1: // Relax
        break;
      case 2: // Not Today
        stressedCharacter.perseverences.splice(index, 1);
        break;
      case 3: // Unstoppable
        stressedCharacter.perseverences.splice(index, 1);
        break;
      case 4: // Enough of this shit
        perseverence.attributeModifier = perseverence.attributeModifier!! * -1;
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressedCharacter,
          perseverence
        );
        stressedCharacter.perseverences.splice(index, 1);
        break;
      case 5: // Focus
        perseverence.attributeModifier = perseverence.attributeModifier!! * -1;
        Roll20Util.updateNumericalPropertiesWithValueFromPerseverenceItem(
          stressedCharacter,
          perseverence
        );
        stressedCharacter.perseverences.splice(index, 1);
        break;
      default:
        break;
    }

    return stressedCharacter;
  }
}
