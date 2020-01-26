import { StressCommandHandler } from './stress/StressCommandHandler';
import { StressProcessor } from './stress/StressProcessor';
import { StressStateManager } from './stress/StressStateManager';
import { StressItemManager } from './stress/StressItemManager';
import { Chatter } from './shared/Chatter';

const stressItemManager = new StressItemManager();
const stressStateManager = new StressStateManager();
const chatter = new Chatter();
const stressProcessor = new StressProcessor(stressItemManager, stressStateManager, chatter);

new StressCommandHandler(stressStateManager, stressProcessor);
