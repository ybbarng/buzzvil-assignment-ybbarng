export type SkillType = "attack" | "defend" | "heal" | "buff" | "debuff";

export type BuffTarget = "atk" | "def";

interface SkillBase {
  name: string;
  mpCost: number;
  isDefault: boolean;
}

interface AttackSkill extends SkillBase {
  type: "attack";
  multiplier: number;
}

interface DefendSkill extends SkillBase {
  type: "defend";
}

interface HealSkill extends SkillBase {
  type: "heal";
  healAmount: number;
}

interface BuffSkill extends SkillBase {
  type: "buff";
  target: BuffTarget;
  value: number;
  duration: number;
}

interface DebuffSkill extends SkillBase {
  type: "debuff";
  target: BuffTarget;
  value: number;
  duration: number;
}

export type Skill =
  | AttackSkill
  | DefendSkill
  | HealSkill
  | BuffSkill
  | DebuffSkill;
