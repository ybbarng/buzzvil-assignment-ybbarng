import type { Stats } from "@/types/character";
import type { Skill } from "@/types/skill";

export interface ActiveBuff {
  target: "atk" | "def";
  value: number;
  remainingTurns: number;
  isDebuff: boolean;
}

export interface BattleCharacter {
  name: string;
  baseStats: Stats;
  currentHp: number;
  currentMp: number;
  skills: Skill[];
  buffs: ActiveBuff[];
  isDefending: boolean;
}

export interface BattleLogEntry {
  round: number;
  actor: "player" | "enemy";
  message: string;
}
