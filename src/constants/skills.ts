import {
  ArrowDown,
  ArrowUp,
  Heart,
  type LucideIcon,
  Shield,
  Sword,
} from "lucide-react";
import type { Skill, SkillType } from "@/types/skill";

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

export const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  attack: "공격",
  defend: "방어",
  heal: "회복",
  buff: "버프",
  debuff: "디버프",
};

export const SKILL_TYPE_ICONS: Record<SkillType, LucideIcon> = {
  attack: Sword,
  defend: Shield,
  heal: Heart,
  buff: ArrowUp,
  debuff: ArrowDown,
};
