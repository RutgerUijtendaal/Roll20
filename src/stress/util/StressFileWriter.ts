import { Roll20Util } from '../../shared/Roll20Util';
import { Logger } from '../../shared/Logger';

export class StressFileWriter {
  handoutName = 'Stress for {0}';

  // Util
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
  listItemWithDesc = '<li>{0}: {1} -- <a href="!&#13!perseverence {2}">Consume</a></li>';

  /**
   * Create a blank note for a newly registered {@link PlayerCharacter}. 
   * 
   * @param playerCharacter Character to create the note for. The PlayerId from this is used, as all
   * handouts have to be associated with a player.
   */
  createEmptyStressNote(playerCharacter: PlayerCharacter) {
    const handoutName = this.stringFormat(this.handoutName, playerCharacter.name);

    if (this.isHandoutPresent(playerCharacter, handoutName)) {
      Logger.debug(`Handout Ability already present.`);
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

  /**
   * Update the name in the title of note. Gets all notes with oldName and updates them to 
   * include the newName.
   * 
   * This updates the title of **every** Handout that includes the StressedCharacters name and isn't
   * limited to a single player
   * 
   * @param oldName name currently on the note title.
   * @param newName name to set the note title to.
   */
  updateStressNoteName(oldName: string, newName: string) {
    const handoutName = this.stringFormat(this.handoutName, oldName);

    const handouts = Roll20Util.getHandoutsByName(handoutName);

    if (handouts !== undefined) {
      handouts.forEach(handout => {
        handout.set('name', this.stringFormat(this.handoutName, newName));
      });
    }
  }

  /**
   * Update the note of Handouts to reflect changes in a StressedCharacters list of stresses
   * and perseverences. Simply rebuilds the entire note. 
   * 
   * This updates the note of **every** Handout that includes the StressedCharacters name and isn't
   * limited to a single player.
   * 
   * @param stressedCharacter character to update the note for.
   */
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
    return str.replace(/{(\d+)}/g, (_match, index) => args[index] || '');
  }

  private isHandoutPresent(playerCharacter: PlayerCharacter, handoutName: string): boolean {
    return Roll20Util.getHandoutOnPlayer(handoutName, playerCharacter.playerId) !== undefined;
  }
}
