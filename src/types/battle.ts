import type { Stats } from "@/types/character";
import type { Skill } from "@/types/skill";

export interface BattleCharacter {
  name: string;
  baseStats: Stats;
  currentHp: number;
  currentMp: number;
  skills: Skill[];
  isDefending: boolean;
}
