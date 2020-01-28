import { Roll20Util } from '../../shared/Roll20Util';
import { Logger } from '../../shared/Logger';

export class StressFileWriter {
  handoutName = 'Stress for {0}';

  start = '<h3>Your debuff list</h3>'
  emptyLine = '<p><br></p>'
  subStart = '<h5>This list is automatically kept up to date</h5><h5>Oldest debuffs are at the top and will be removed first</h5>'
  currentStress = 'Current stress: {0}'
  listStart = '<ul>'
  listItem = '<li>{0}</li>'
  listItemWithMixin = '<li>{0} and {1}</li>'
  listEndEnd = '</ul>'
  emptyListMessage = 'Woo! Stress free'

  createEmptyStressNote(playerCharacter: PlayerCharacter) {
    const handoutName = this.stringFormat(this.handoutName, playerCharacter.name);

    if (this.isHandoutPresent(playerCharacter, handoutName)) {
      Logger.debug(`Handout Ability already present on player ${playerCharacter.playerId}`);
      return;
    }

    createObj('handout', {
      name: handoutName,
      inplayerjournals: playerCharacter.playerId,
      controlledby: ''
    });

    this.updateStressNoteForStressedCharacter({
      ...playerCharacter,
      stressValue: 0,
      stresses: []
    })
  }

  updateStressNoteName(oldName: string, newName: string) {
    const handoutName = this.stringFormat(this.handoutName, oldName);

    const handouts = Roll20Util.getHandoutsByName(handoutName);

    if (handouts !== undefined) {
      handouts.forEach(handout => {
        handout.set('name', this.stringFormat(this.handoutName, newName));
      });
    }
  }

  updateStressNoteForStressedCharacter(stressedCharacter: StressedCharacter) {
    const handoutName = this.stringFormat(this.handoutName, stressedCharacter.name);

    const handouts = Roll20Util.getHandoutsByName(handoutName);

    if (handouts !== undefined) {
      handouts.forEach(handout => {
        handout.set('notes', this.buildNote(stressedCharacter));
      });
    }
  }

  private buildNote(stressedCharacter: StressedCharacter): string {
    let note = ''
    note = note + this.start;
    note = note + this.subStart;
    note = note + this.emptyLine;
    note = note + this.stringFormat(this.currentStress, ""+stressedCharacter.stressValue)
    note = note + this.emptyLine;

    if(stressedCharacter.stresses.length === 0) {
      note = note + this.emptyListMessage;
      return note;
    }

    stressedCharacter.stresses.forEach(stress => {
      if(stress.mixin) {
        note = note + this.stringFormat(this.listItemWithMixin, stress.name, stress.mixin.name);
      } else {
        note = note + this.stringFormat(this.listItem, stress.name);
      }
    })

    return note;
  }

  private stringFormat(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  }

  private isHandoutPresent(playerCharacter: PlayerCharacter, handoutName: string): boolean {
    return Roll20Util.getHandoutOnPlayer(handoutName, playerCharacter.playerId) !== undefined;
  }


}
