import { Logger } from '../../shared/Logger';
import { StressStateManager } from '../persistence/StressStateManager';
import { StressFileWriter } from '../util/StressFileWriter';

export class StressNameChangeHandler {
  stressStateManager: StressStateManager;
  stressFileWriter: StressFileWriter;

  constructor(stressStateManager: StressStateManager, stressFileWriter: StressFileWriter) {
    this.stressStateManager = stressStateManager;
    this.stressFileWriter = stressFileWriter;
    this.register();
  }

  register() {
    Logger.info('Registering Stress Name Change Handler');

    on('change:character', (cur, prev) => {
      if (cur.get('name') !== prev.name) {
        this.handle(cur, prev);
      }
    });
  }

  private handle(cur: Character, prev: OldCharacter) {
    const stressedCharacter = this.stressStateManager.getStressedCharacter({
      characterId: cur.id,
      playerId: '',
      name: '',
    });

    if(!stressedCharacter) {
      return;
    }

    stressedCharacter.name = cur.get('name');
    Logger.info(`Changed name ${prev.name} to ${stressedCharacter.name}`)
    this.stressStateManager.updateStressedCharacter(stressedCharacter);
    this.stressFileWriter.updateStressNoteName(prev.name, stressedCharacter.name);
  }
}
