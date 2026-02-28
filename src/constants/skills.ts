import type { Skill } from "@/types/skill";

export const DEFAULT_SKILLS: Skill[] = [
  {
    name: "공격",
    type: "attack",
    mpCost: 0,
    multiplier: 1.0,
    isDefault: true,
  },
  {
    name: "방어",
    type: "defend",
    mpCost: 0,
    isDefault: true,
  },
];

export const MAX_CUSTOM_SKILLS = 2;

export const CUSTOM_SKILL_TYPES = ["attack", "heal", "buff", "debuff"] as const;

export type CustomSkillType = (typeof CUSTOM_SKILL_TYPES)[number];

export const SKILL_TYPE_LABELS: Record<CustomSkillType, string> = {
  attack: "공격",
  heal: "회복",
  buff: "버프",
  debuff: "디버프",
};
