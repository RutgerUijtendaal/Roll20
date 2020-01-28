import { Logger } from '../../shared/Logger';
import { StressStateManager } from '../persistence/StressStateManager';

export class StressNameChangeHandler {
  stressStateManager: StressStateManager;

  constructor(stressStateManager: StressStateManager) {
    this.stressStateManager = stressStateManager;
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
  }
}
