import { StressCommandHandler } from './stress/StressCommandHandler';
import { StressProcessor } from './stress/StressProcessor';
import { StressStateManager } from './stress/StressStateManager';
import { StressItemManager } from './stress/StressItemManager';

const stressItemManager = new StressItemManager()
const stressStateManager = new StressStateManager();
const stressProcessor = new StressProcessor(stressItemManager, stressStateManager);

new StressCommandHandler(stressStateManager, stressProcessor);