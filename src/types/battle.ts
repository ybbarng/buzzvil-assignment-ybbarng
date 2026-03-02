import type { Stats } from "@/types/character";
import type { BuffTarget, Skill, SkillType } from "@/types/skill";

export interface ActiveBuff {
  target: BuffTarget;
  value: number;
  remainingTurns: number;
}

export interface BattleLogEntry {
  round: number;
  actor: string;
  skillName: string;
  skillType: SkillType;
  value: number;
}

export interface BattleCharacter {
  name: string;
  baseStats: Stats;
  currentHp: number;
  currentMp: number;
  skills: Skill[];
  isDefending: boolean;
  buffs: ActiveBuff[];
}

/** CharacterPanel 표시용 스냅샷 (스킬 목록 제외) */
export type CharacterSnapshot = Omit<BattleCharacter, "skills">;
