const perseverenceRelax: PerseverenceItem = {
  id: 1,
  type: 'perseverence',
  name: "Relax",
  desc: "-30 Stress",
  weight: 1
}

const perseverenceNotToday: PerseverenceItem = {
  id: 2,
  type: 'perseverence',
  name: "Not Today",
  desc: "Death Ward",
  weight: 1
}

const perseverenceUnstoppable: PerseverenceItem = {
  id: 3,
  type: 'perseverence',
  name: "Unstoppable",
  desc: "1 Legendary Resistance",
  weight: 1
}


const perseverenceEnoughOfThisShit: PerseverenceItem = {
  id: 4,
  type: 'perseverence',
  name: "Enough of this shit",
  desc: "+2 to hit, damage and save DCs",
  targetAttributes: [
    { name: 'Melee Damage', target: 'global_melee_damage_bonus', amount: 2 },
    { name: 'Ranged Damage', target: 'global_ranged_damage_bonus', amount: 2 },
    { name: 'Melee Attack', target: 'global_melee_attack_bonus', amount: 2 },
    { name: 'Ranged Attack', target: 'global_ranged_attack_bonus', amount: 2 },
    { name: 'Saving Throws', target: 'global_saving_bonus', amount: 2 }
  ],
  weight: 1
}

const perseverenceFocus: PerseverenceItem = {
  id: 5,
  type: 'perseverence',
  name: "Focus",
  desc: "+2 to all skill checks",
  targetAttributes: [
    { name: 'Skill Checks', target: 'global_check_bonus', amount: 2 },
  ],
  weight: 1
}

export const perseverences: PerseverenceItem[] = [
  perseverenceRelax,
  perseverenceNotToday,
  perseverenceUnstoppable,
  perseverenceEnoughOfThisShit,
  perseverenceFocus
]