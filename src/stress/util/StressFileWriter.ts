import { Roll20Util } from '../../shared/Roll20Util';
import { Logger } from '../../shared/Logger';

export class StressFileWriter {
  handoutName = 'Stress for {0}';

  // Util
  emptyLine = '<p><br></p>';
  horizontalLine = '<hr>';
  // Generic
  currentStress = 'Current stress: {0}';
  listItem = '<li>{0}</li>';
  // Debuffs
  debuffStart = '<h3>Your debuff list</h3>';
  debufSubStart =
    '<h5>This list is automatically kept up to date</h5><h5>Oldest debuffs are at the top and will be removed first</h5>';
  listItemWithMixin = '<li>{0} and {1}</li>';
  emptyDebuffListMessage = 'Woo! Stress free';
  // Perseverence
  perseverenceStart = '<h3>Your perseverence list</h3>';
  perseverenceSubStart = '<h5>Click on the button to remove a used perseverence</h5>';
  emptyPerseverenceList = 'No perseverence buffs active.';
  listItemWithDesc = '<li>{0}: {1} -- <a href="!&#13!perseverence {2}">Consumed</a></li>';

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
      stresses: [],
      perseverences: []
    });
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
    let note = '';
    note = note + this.stringFormat(this.currentStress, '' + stressedCharacter.stressValue);
    note = note + this.horizontalLine;
    note = note + this.debuffStart;
    note = note + this.debufSubStart;
    note = note + this.horizontalLine;

    if (stressedCharacter.stresses.length === 0) {
      note = note + this.emptyDebuffListMessage;
    } else {
      stressedCharacter.stresses.forEach(stress => {
        if (stress.mixin) {
          note = note + this.stringFormat(this.listItemWithMixin, stress.name, stress.mixin.name);
        } else {
          note = note + this.stringFormat(this.listItem, stress.name);
        }
      });
    }

    note = note + this.horizontalLine;
    note = note + this.perseverenceStart;
    note = note + this.perseverenceSubStart;
    note = note + this.horizontalLine;

    if(stressedCharacter.perseverences.length === 0) {
      note = note + this.emptyPerseverenceList;
    } else {
      stressedCharacter.perseverences.forEach(perseverence => {
        note = note + this.stringFormat(this.listItemWithDesc, perseverence.name, perseverence.desc, perseverence.uuid!!)
      })
    }

    return note;
  }

  private stringFormat(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  }

  private isHandoutPresent(playerCharacter: PlayerCharacter, handoutName: string): boolean {
    return Roll20Util.getHandoutOnPlayer(handoutName, playerCharacter.playerId) !== undefined;
  }
}
