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
  const record = data as Record<string, unknown>;
  return (
    record.version === REPLAY_VERSION &&
    typeof record.id === "string" &&
    typeof record.timestamp === "number" &&
    typeof record.playerName === "string" &&
    typeof record.enemyName === "string" &&
    typeof record.totalTurns === "number" &&
    typeof record.difficulty === "string" &&
    VALID_DIFFICULTIES.has(record.difficulty) &&
    typeof record.outcome === "string" &&
    VALID_OUTCOMES.has(record.outcome) &&
    Array.isArray(record.events) &&
    record.events.length > 0
  );
}
