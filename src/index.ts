import { StressCommandHandler } from './stress/StressCommandHandler';
import { StressProcessor } from './stress/StressProcessor';
import { StressStateManager } from './stress/StressStateManager';
import { StressItemManager } from './stress/StressItemManager';
import { Chatter } from './shared/Chatter';
import { StressAbilityCreator } from './stress/StressAbilityCreator';
import { StressRemovalService } from './stress/StressRemovalService';
import { StressAdditionService } from './stress/StressAdditionService';
import { StressNameChangeListener } from './stress/StressNameChangeListener';

const chatter = new Chatter();
const stressAbilityCreator = new StressAbilityCreator();
const stressItemManager = new StressItemManager();
const stressAdditionService = new StressAdditionService(stressItemManager, chatter);
const stressRemovalService = new StressRemovalService(stressItemManager, chatter);
const stressStateManager = new StressStateManager(stressAbilityCreator);
const stressProcessor = new StressProcessor(
  stressStateManager,
  stressAdditionService,
  stressRemovalService,
  chatter
  );
  
new StressNameChangeListener(stressStateManager);
new StressCommandHandler(stressStateManager, stressProcessor);
