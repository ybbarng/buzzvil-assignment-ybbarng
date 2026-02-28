import type { Stats } from "@/types/character";
import type { Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

interface EnemyConfig {
  name: string;
  stats: Stats;
  skills: Skill[];
}

export const ENEMIES: Record<Difficulty, EnemyConfig> = {
  easy: {
    name: "훈련 로봇",
    stats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
    skills: [
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend", mpCost: 0, isDefault: true },
    ],
  },
  normal: {
    name: "전투 드론",
    stats: { hp: 110, mp: 50, atk: 15, def: 12, spd: 10 },
    skills: [
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend", mpCost: 0, isDefault: true },
    ],
  },
  hard: {
    name: "타론 요원",
    stats: { hp: 140, mp: 70, atk: 20, def: 16, spd: 14 },
    skills: [
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend", mpCost: 0, isDefault: true },
    ],
  },
};
