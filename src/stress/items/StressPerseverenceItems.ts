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
  attributeModifier: 2,
  targetAttributes: [
    'global_melee_damage_bonus', 
    'global_ranged_damage_bonus',
    'global_melee_attack_bonus', 
    'global_ranged_attack_bonus',
    'global_saving_bonus'
  ],
  weight: 1
}

const perseverenceFocus: PerseverenceItem = {
  id: 5,
  type: 'perseverence',
  name: "Focus",
  desc: "+2 to all skill checks",
  attributeModifier: 2,
  targetAttributes: [
    'acrobatics_bonus',
    'animalhandling_bonus',
    'arcana_bonus',
    'athletics_bonus',
    'deception_bonus',
    'history_bonus',
    'insight_bonus',
    'intimidation_bonus',
    'investigation_bonus',
    'medicine_bonus',
    'nature_bonus',
    'perception_bonus',
    'performance_bonus',
    'persuasion_bonus',
    'religion_bonus',
    'sleightofhand_bonus',
    'stealth_bonus',
    'survival_bonus'
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