const stressStrength: StressItem = {
  id: 1,
  type: 'debuff',
  name: '-2 to Strength',
  weight: 2,
  targetAttributes: [{ name: 'Stength', target: 'strength', amount: -2 }]
};

const stressCharisma: StressItem = {
  id: 2,
  type: 'debuff',
  name: '-2 to Charisma',
  weight: 2,
  targetAttributes: [{ name: 'Charisma', target: 'charisma', amount: -2 }]
};

const stressIntelligence: StressItem = {
  id: 3,
  type: 'debuff',
  name: '-2 to Intelligence',
  weight: 2,
  targetAttributes: [{ name: 'Intelligence', target: 'intelligence', amount: -2 }]
};

const stressWisdom: StressItem = {
  id: 4,
  type: 'debuff',
  name: '-2 to Wisdom',
  weight: 2,
  targetAttributes: [{ name: 'Wisdom', target: 'wisdom', amount: -2 }]
};

const stressDexterity: StressItem = {
  id: 5,
  type: 'debuff',
  name: '-2 to Dexterity',
  weight: 2,
  targetAttributes: [{ name: 'Dexterity', target: 'dexterity', amount: -2 }]
};

const stressToHit: StressItem = {
  id: 6,
  type: 'debuff',
  name: '-1 to Hit',
  weight: 1,
  targetAttributes: [
    { name: 'Melee Attack Bonus', target: 'global_melee_attack_bonus', amount: -1 },
    { name: 'Ranged Attack Bonus', target: 'global_ranged_attack_bonus', amount: -1 }
  ]
};

const stressDamage: StressItem = {
  id: 7,
  type: 'debuff',
  name: '-1 to Damage',
  weight: 2,
  targetAttributes: [
    { name: 'Melee Damage Bonus', target: 'global_melee_damage_bonus', amount: -1 },
    { name: 'Ranged Damage Bonus', target: 'global_ranged_damage_bonus', amount: -1 }
  ]
};

const stressSavingThrow: StressItem = {
  id: 8,
  type: 'debuff',
  name: '-1 to Saving Throws',
  weight: 1,
  targetAttributes: [{ name: 'Saving Throws', target: 'global_saving_bonus', amount: -1 }]
};

const stressPerception: StressItem = {
  id: 9,
  type: 'debuff',
  name: '-1 to Perception',
  weight: 2,
  targetAttributes: [{ name: 'Perception', target: 'perception_bonus', amount: -1 }]
};

const stressAthletics: StressItem = {
  id: 10,
  type: 'debuff',
  name: '-1 to Athletics',
  weight: 1,
  targetAttributes: [{ name: 'Atheletics', target: 'athletics_bonus', amount: -1 }]
};

const stressAcrobaticsAndPerformance: StressItem = {
  id: 11,
  type: 'debuff',
  name: '-1 to Acrobatics & Performance',
  weight: 2,
  targetAttributes: [
    { name: 'Acrobatics', target: 'acrobatics_bonus', amount: -1 },
    { name: 'Performance', target: 'performance_bonus', amount: -1 }
  ]
};

const stressStealthAndSlightOfHand: StressItem = {
  id: 12,
  type: 'debuff',
  name: '-1 to Stealth and Sleight of Hand',
  weight: 2,
  targetAttributes: [
    { name: 'Stealth', target: 'stealth_bonus', amount: -1 },
    { name: 'Sleight of Hand', target: 'sleightofhand_bonus', amount: -1 }
  ]
};

const stressInsightAndMedince: StressItem = {
  id: 13,
  type: 'debuff',
  name: '-1 to Insight and Medicine',
  weight: 2,
  targetAttributes: [
    { name: 'Insight', target: 'insight_bonus', amount: -1 },
    { name: 'Medicine', target: 'medicine_bonus', amount: -1 }
  ]
};

const stressHistoryReligionCulture: StressItem = {
  id: 14,
  type: 'debuff',
  name: '-1 to History, Religion and Culture',
  weight: 2,
  targetAttributes: [
    { name: 'History', target: 'history_bonus', amount: -1 },
    { name: 'Religion', target: 'religion_bonus', amount: -1 },
    { name: 'Culture', target: 'custom_skill_1_bonus', amount: -1 }
  ]
};

const stressInvestigaton: StressItem = {
  id: 15,
  type: 'debuff',
  name: '-1 to Investigation',
  weight: 2,
  targetAttributes: [{ name: 'Investigation', target: 'investigation_bonus', amount: -1 }]
};

const stressPersuasionAndDeception: StressItem = {
  id: 16,
  type: 'debuff',
  name: '-1 to Persuasion and Deception',
  weight: 2,
  targetAttributes: [
    { name: 'Persuasion', target: 'persuasion_bonus', amount: -1 },
    { name: 'Deception', target: 'deception_bonus', amount: -1 }
  ]
};

const stressIntimidaton: StressItem = {
  id: 17,
  type: 'debuff',
  name: '-2 to Intimidaton',
  weight: 2,
  targetAttributes: [{ name: 'Intimidation', target: 'intimidation_bonus', amount: -2 }]
};

const stressInitiative: StressItem = {
  id: 18,
  type: 'debuff',
  name: '-1 to Initiative',
  weight: 2,
  targetAttributes: [{ name: 'Initiative', target: 'initiative', amount: -1 }]
};

const stressSurvivalAndNature: StressItem = {
  id: 19,
  type: 'debuff',
  name: '-1 to Survival and Nature',
  weight: 2,
  targetAttributes: [
    { name: 'Survival', target: 'nature_bonus', amount: -1 },
    { name: 'Nature', target: 'survival_bonus', amount: -1 }
  ]
};

const stressAnimalHandlingIntimidation: StressItem = {
  id: 20,
  type: 'debuff',
  name: '-2 to Animal Handling, +1 to Intimidation',
  weight: 2,
  targetAttributes: [
    { name: 'Intimidation', target: 'intimidation_bonus', amount: 1 },
    { name: 'Animal Handling', target: 'animalhandling_bonus', amount: -2 }
  ]
};

export const stresses: StressItem[] = [
  stressStrength,
  stressCharisma,
  stressIntelligence,
  stressDexterity,
  stressWisdom,
  stressToHit,
  stressDamage,
  stressSavingThrow,
  stressPerception,
  stressAthletics,
  stressAcrobaticsAndPerformance,
  stressStealthAndSlightOfHand,
  stressInsightAndMedince,
  stressHistoryReligionCulture,
  stressInvestigaton,
  stressPersuasionAndDeception,
  stressIntimidaton,
  stressInitiative,
  stressSurvivalAndNature
];
