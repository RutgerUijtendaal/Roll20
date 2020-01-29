import { StressCommandHandler } from './stress/eventhandlers/StressCommandHandler';
import { StressProcessorService } from './stress/services/StressProcessorService';
import { StressStateManager } from './stress/persistence/StressStateManager';
import { StressItemManager } from './stress/items/StressItemManager';
import { StressAbilityCreator } from './stress/util/StressAbilityCreator';
import { StressRemovalService } from './stress/services/StressRemovalService';
import { StressAdditionService } from './stress/services/StressAdditionService';
import { StressNameChangeHandler } from './stress/eventhandlers/StressNameChangeHandler';
import { StressChatter } from './stress/util/StressChatter';
import { StressFileWriter } from './stress/util/StressFileWriter';
import { StressPerseverenceService } from './stress/services/StressPerseverenceService';

const chatter = new StressChatter();
const stressAbilityCreator = new StressAbilityCreator();
const stressFileWriter = new StressFileWriter();
const stressItemManager = new StressItemManager();
const stressStateManager = new StressStateManager();

const stressProcessor = new StressProcessorService(
  stressStateManager,
  stressFileWriter,
  stressItemManager,
  chatter
);

new StressNameChangeHandler(stressStateManager, stressFileWriter);
new StressCommandHandler(
  stressStateManager,
  stressProcessor,
  stressAbilityCreator,
  stressFileWriter,
  chatter
);
