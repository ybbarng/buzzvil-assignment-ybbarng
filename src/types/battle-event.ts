import type { CharacterSnapshot } from "@/types/battle";
import type { BattleOutcome } from "@/types/game";
import type { SkillType } from "@/types/skill";

interface EventBase {
  round: number;
  playerSnapshot: CharacterSnapshot;
  enemySnapshot: CharacterSnapshot;
}

export interface RoundStartEvent extends EventBase {
  type: "round-start";
}

export interface DefendEvent extends EventBase {
  type: "defend";
  actor: "player" | "enemy";
  actorName: string;
}

export interface SpeedCompareEvent extends EventBase {
  type: "speed-compare";
  firstName: string;
  firstSpd: number;
  secondName: string;
  secondSpd: number;
}

export interface SkillUseEvent extends EventBase {
  type: "skill-use";
  actor: "player" | "enemy";
  actorName: string;
  targetName: string;
  skillName: string;
  skillType: SkillType;
  mpCost: number;
}

export interface SkillEffectEvent extends EventBase {
  type: "skill-effect";
  actor: "player" | "enemy";
  actorName: string;
  targetName: string;
  skillName: string;
  skillType: SkillType;
  value: number;
}

export interface SkipTurnEvent extends EventBase {
  type: "skip-turn";
  actor: "player" | "enemy";
  actorName: string;
  reason: "defeated" | "no-mp";
  skillName?: string;
}

export interface BuffExpireEvent extends EventBase {
  type: "buff-expire";
  targetName: string;
  buffTarget: "atk" | "def";
  wasBuff: boolean;
}

export interface BattleEndEvent extends EventBase {
  type: "battle-end";
  outcome: BattleOutcome;
}

export type RoundEvent =
  | RoundStartEvent
  | DefendEvent
  | SpeedCompareEvent
  | SkillUseEvent
  | SkillEffectEvent
  | SkipTurnEvent
  | BuffExpireEvent
  | BattleEndEvent;
