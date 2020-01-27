import { StressCommandHandler } from './stress/StressCommandHandler';
import { StressProcessor } from './stress/StressProcessor';
import { StressStateManager } from './stress/StressStateManager';
import { StressItemManager } from './stress/StressItemManager';
import { Chatter } from './shared/Chatter';
import { StressAbilityCreator } from './stress/StressAbilityCreator';

const chatter = new Chatter();
const stressAbilityCreator = new StressAbilityCreator();
const stressItemManager = new StressItemManager();
const stressStateManager = new StressStateManager();
const stressProcessor = new StressProcessor(stressItemManager, stressStateManager, chatter);

new StressCommandHandler(stressStateManager, stressProcessor, stressAbilityCreator);
