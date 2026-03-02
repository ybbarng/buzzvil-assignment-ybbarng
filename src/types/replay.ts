import type { RoundEvent } from "@/types/battle-event";
import type { BattleOutcome, Difficulty } from "@/types/game";

/** 리플레이 데이터 스키마 버전. 호환 불가 변경 시 증가. */
export const REPLAY_VERSION = 1;

export interface ReplayData {
  version: number;
  id: string;
  timestamp: number;
  playerName: string;
  enemyName: string;
  difficulty: Difficulty;
  outcome: BattleOutcome;
  totalTurns: number;
  events: RoundEvent[];
}

const VALID_DIFFICULTIES = new Set<string>(["easy", "normal", "hard"]);
const VALID_OUTCOMES = new Set<string>(["win", "lose", "draw"]);

/** localStorage에서 읽은 데이터가 유효한 ReplayData인지 검증 */
export function isValidReplay(data: unknown): data is ReplayData {
  if (typeof data !== "object" || data === null) return false;
  const r = data as Record<string, unknown>;
  return (
    r.version === REPLAY_VERSION &&
    typeof r.id === "string" &&
    typeof r.timestamp === "number" &&
    typeof r.playerName === "string" &&
    typeof r.enemyName === "string" &&
    typeof r.totalTurns === "number" &&
    typeof r.difficulty === "string" &&
    VALID_DIFFICULTIES.has(r.difficulty) &&
    typeof r.outcome === "string" &&
    VALID_OUTCOMES.has(r.outcome) &&
    Array.isArray(r.events) &&
    r.events.length > 0
  );
}
