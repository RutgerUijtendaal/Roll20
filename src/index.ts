import { StressCommandHandler } from './stress/handlers/StressCommandHandler';
import { StressProcessorService } from './stress/services/StressProcessorService';
import { StressStateManager } from './stress/persistence/StressStateManager';
import { StressItemManager } from './stress/items/StressItemManager';
import { StressAbilityCreator } from './stress/util/StressAbilityCreator';
import { StressRemovalService } from './stress/services/StressRemovalService';
import { StressAdditionService } from './stress/services/StressAdditionService';
import { StressNameChangeHandler } from './stress/handlers/StressNameChangeHandler';
import { StressChatter } from './stress/util/StressChatter';
import { StressFileWriter } from './stress/util/StressFileWriter';

const chatter = new StressChatter();
const stressAbilityCreator = new StressAbilityCreator();
const stressFileWriter = new StressFileWriter();
const stressItemManager = new StressItemManager();
const stressAdditionService = new StressAdditionService(stressItemManager, chatter);
const stressRemovalService = new StressRemovalService(stressItemManager, chatter);
const stressStateManager = new StressStateManager();
const stressProcessor = new StressProcessorService(
  stressStateManager,
  stressAdditionService,
  stressRemovalService,
  stressFileWriter,
  chatter
);
  
new StressNameChangeHandler(stressStateManager, stressFileWriter);
new StressCommandHandler(stressStateManager, stressProcessor, stressAbilityCreator, stressFileWriter, chatter);
