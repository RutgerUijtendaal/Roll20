import { Logger } from '../shared/Logger';
import { StressStateManager } from './StressStateManager';

export class StressNameChangeListener {
  stressStateManager: StressStateManager;
  logger: Logger;

  constructor(stressStateManager: StressStateManager) {
    this.logger = Logger.getInstance();
    this.stressStateManager = stressStateManager;
    this.register();
  }

  register() {
    this.logger.info('Registering Stress Command Handler');

    on('change:character', (cur, prev) => {
      if (cur.get('name') !== prev.name) {
        this.handleNameChange(cur, prev);
      }
    });
  }

  private handleNameChange(cur: Character, prev: OldCharacter) {
    const stressedCharacter = this.stressStateManager.getStressedCharacter({
      characterId: cur.id,
      playerId: '',
      name: '',
    });

    if(!stressedCharacter) {
      return;
    }

    stressedCharacter.name = cur.get('name');
    this.logger.info(`Changed name ${prev.name} to ${stressedCharacter.name}`)
    this.stressStateManager.updateStressedCharacter(stressedCharacter);
  }
}
