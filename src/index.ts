import { StressCommandHandler } from './stress/handlers/StressCommandHandler';
import { StressProcessorService } from './stress/services/StressProcessorService';
import { StressStateManager } from './stress/persistence/StressStateManager';
import { StressItemManager } from './stress/items/StressItemManager';
import { StressAbilityCreator } from './stress/util/StressAbilityCreator';
import { StressRemovalService } from './stress/services/StressRemovalService';
import { StressAdditionService } from './stress/services/StressAdditionService';
import { StressNameChangeHandler } from './stress/handlers/StressNameChangeHandler';
import { StressChatter } from './stress/util/StressChatter';

const chatter = new StressChatter();
const stressAbilityCreator = new StressAbilityCreator();
const stressItemManager = new StressItemManager();
const stressAdditionService = new StressAdditionService(stressItemManager, chatter);
const stressRemovalService = new StressRemovalService(stressItemManager, chatter);
const stressStateManager = new StressStateManager(stressAbilityCreator);
const stressProcessor = new StressProcessorService(
  stressStateManager,
  stressAdditionService,
  stressRemovalService,
  chatter
);
  
new StressNameChangeHandler(stressStateManager);
new StressCommandHandler(stressStateManager, stressProcessor, chatter);
