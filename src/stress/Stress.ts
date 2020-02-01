import { StressChatter } from './util/StressChatter';
import { StressAbilityCreator } from './util/StressAbilityCreator';
import { StressFileWriter } from './util/StressFileWriter';
import { StressItemManager } from './items/StressItemManager';
import { StressStateManager } from './persistence/StressStateManager';
import { StressProcessorService } from './services/StressProcessorService';
import { StressNameChangeHandler } from './eventhandlers/StressNameChangeHandler';
import { StressCommandHandler } from './eventhandlers/StressCommandHandler';

export class Stress {
  chatter:  StressChatter;
  stressAbilityCreator: StressAbilityCreator;
  stressFileWriter: StressFileWriter;
  stressItemManager: StressItemManager;
  stressStateManager: StressStateManager;
  stressProcessor: StressProcessorService;
  stressNamechangeHandler: StressNameChangeHandler;
  stressCommandHandler: StressCommandHandler;

  constructor() {
    this.chatter = new StressChatter();
    this.stressAbilityCreator = new StressAbilityCreator();
    this.stressFileWriter = new StressFileWriter();
    this.stressItemManager = new StressItemManager();
    this.stressStateManager = new StressStateManager();
    this.stressProcessor = new StressProcessorService(
      this.stressStateManager,
      this.stressFileWriter,
      this.stressItemManager,
      this.chatter
    );
    this.stressNamechangeHandler = new StressNameChangeHandler(this.stressStateManager, this.stressFileWriter);
    this.stressCommandHandler = new StressCommandHandler(
      this.stressStateManager,
      this.stressProcessor,
      this.stressAbilityCreator,
      this.stressFileWriter,
      this.chatter
    );
  }
}

