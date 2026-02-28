import type { Stats } from "@/types/character";
import type { Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

interface EnemyConfig {
  name: string;
  stats: Stats;
  skills: Skill[];
}

const EASY_SKILLS: Skill[] = [
  { name: "공격", type: "attack", mpCost: 0, multiplier: 1.0, isDefault: true },
  { name: "방어", type: "defend", mpCost: 0, isDefault: true },
  {
    name: "강타",
    type: "attack",
    mpCost: 8,
    multiplier: 1.3,
    isDefault: false,
  },
];

const NORMAL_SKILLS: Skill[] = [
  { name: "공격", type: "attack", mpCost: 0, multiplier: 1.0, isDefault: true },
  { name: "방어", type: "defend", mpCost: 0, isDefault: true },
  {
    name: "강타",
    type: "attack",
    mpCost: 10,
    multiplier: 1.5,
    isDefault: false,
  },
  { name: "회복", type: "heal", mpCost: 10, healAmount: 20, isDefault: false },
];

const HARD_SKILLS: Skill[] = [
  { name: "공격", type: "attack", mpCost: 0, multiplier: 1.0, isDefault: true },
  { name: "방어", type: "defend", mpCost: 0, isDefault: true },
  {
    name: "강타",
    type: "attack",
    mpCost: 12,
    multiplier: 1.7,
    isDefault: false,
  },
  { name: "회복", type: "heal", mpCost: 12, healAmount: 30, isDefault: false },
  {
    name: "약화",
    type: "debuff",
    mpCost: 10,
    target: "def",
    value: 5,
    duration: 3,
    isDefault: false,
  },
];

export const ENEMIES: Record<Difficulty, EnemyConfig> = {
  easy: {
    name: "훈련 로봇",
    stats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
    skills: EASY_SKILLS,
  },
  normal: {
    name: "전투 드론",
    stats: { hp: 110, mp: 50, atk: 15, def: 12, spd: 10 },
    skills: NORMAL_SKILLS,
  },
  hard: {
    name: "타론 요원",
    stats: { hp: 140, mp: 70, atk: 20, def: 16, spd: 14 },
    skills: HARD_SKILLS,
  },
};
