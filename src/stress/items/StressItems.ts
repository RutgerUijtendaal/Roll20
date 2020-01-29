const stressStrength: StressItem = {
  id: 1,
  type: 'debuff',
  name: '-2 Strength',
  weight: 2,
  targetAttributes: ['strength'],
  attributeModifier: -2
};

const stressCharisma: StressItem = {
  id: 2,
  type: 'debuff',
  name: '-2 Charisma',
  weight: 2,
  targetAttributes: ['charisma'],
  attributeModifier: -2
};

const stressIntelligence: StressItem = {
  id: 3,
  type: 'debuff',
  name: '-2 Intelligence',
  weight: 2,
  targetAttributes: ['intelligence'],
  attributeModifier: -2
};

const stressWisdom: StressItem = {
  id: 4,
  type: 'debuff',
  name: '-2 Wisdom',
  weight: 2,
  targetAttributes: ['wisdom'],
  attributeModifier: -2
};

const stressDexterity: StressItem = {
  id: 5,
  type: 'debuff',
  name: '-2 Dexterity',
  weight: 2,
  targetAttributes: ['dexterity'],
  attributeModifier: -2
};

const stressToHit: StressItem = {
  id: 6,
  type: 'debuff',
  name: '-1 to Hit',
  weight: 1,
  targetAttributes: ['global_melee_attack_bonus', 'global_ranged_attack_bonus'],
  attributeModifier: -1
};

const stressDamage: StressItem = {
  id: 7,
  type: 'debuff',
  name: '-1 to Damage',
  weight: 2,
  targetAttributes: ['global_melee_damage_bonus', 'global_ranged_damage_bonus'],
  attributeModifier: -1
};

const stressSavingThrow: StressItem = {
  id: 8,
  type: 'debuff',
  name: '-1 to Saving Throws',
  weight: 1,
  targetAttributes: ['global_saving_bonus'],
  attributeModifier: -1
};

const stressPerception: StressItem = {
  id: 9,
  type: 'debuff',
  name: '-1 to Perception',
  weight: 2,
  targetAttributes: ['perception_bonus'],
  attributeModifier: -1
};

const stressAthletics: StressItem = {
  id: 10,
  type: 'debuff',
  name: '-1 to Athletics',
  weight: 1,
  targetAttributes: ['athletics_bonus'],
  attributeModifier: -1
};

const stressAcrobaticsAndPerformance: StressItem = {
  id: 11,
  type: 'debuff',
  name: '-1 to Acrobatics & Performance',
  weight: 2,
  targetAttributes: ['acrobatics_bonus', 'performance_bonus'],
  attributeModifier: -1
};

const stressStealthAndSlightOfHand: StressItem = {
  id: 12,
  type: 'debuff',
  name: '-1 to Stealth and Sleight of Hand',
  weight: 2,
  targetAttributes: ['stealth_bonus', 'sleightofhand_bonus'],
  attributeModifier: -1
};

const stressInsightAndMedince: StressItem = {
  id: 13,
  type: 'debuff',
  name: '-1 Insight and Medicine',
  weight: 2,
  targetAttributes: ['insight_bonus', 'medicine_bonus'],
  attributeModifier: -1
};

const stressHistoryReligionCulture: StressItem = {
  id: 14,
  type: 'debuff',
  name: '-1 History, Religion and Culture',
  weight: 2,
  targetAttributes: ['history_bonus', 'religion_bonus', 'custom_skill_1_bonus'],
  attributeModifier: -1
};

const stressInvestigaton: StressItem = {
  id: 15,
  type: 'debuff',
  name: '-1 Investigation',
  weight: 2,
  targetAttributes: ['investigation_bonus'],
  attributeModifier: -1
};

const stressPersuasionAndDeception: StressItem = {
  id: 16,
  type: 'debuff',
  name: '-1 Persuasion and Deception',
  weight: 2,
  targetAttributes: ['persuasion_bonus','deception_bonus'],
  attributeModifier: -1
};

const stressIntimidaton: StressItem = {
  id: 17,
  type: 'debuff',
  name: '-2 Intimidaton',
  weight: 2,
  targetAttributes: ['intimidation_bonus'],
  attributeModifier: -2
};

const stressInitiative: StressItem = {
  id: 18,
  type: 'debuff',
  name: '-1 Initiative',
  weight: 2,
  targetAttributes: ['initiative'],
  attributeModifier: -1
};

const stressSurvivalAndNature: StressItem = {
  id: 19,
  type: 'debuff',
  name: '-1 Survival and Nature',
  weight: 2,
  targetAttributes: ['nature_bonus', 'survival_bonus'],
  attributeModifier: -1
};

export const stresses: StressItem[] = [
  stressStrength,
  stressCharisma,
  stressIntelligence,
  stressDexterity,
  stressWisdom,
  // stressToHit,
  // stressDamage,
  // stressSavingThrow,
  // stressPerception,
  // stressAthletics,
  // stressAcrobaticsAndPerformance,
  // stressStealthAndSlightOfHand,
  // stressInsightAndMedince,
  // stressHistoryReligionCulture,
  // stressInvestigaton,
  // stressPersuasionAndDeception,
  // stressIntimidaton,
  // stressInitiative,
  // stressSurvivalAndNature
];
