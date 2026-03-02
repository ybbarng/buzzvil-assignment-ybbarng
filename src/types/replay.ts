import type { RoundEvent } from "@/types/battle-event";
import type { BattleOutcome, Difficulty } from "@/types/game";

export interface ReplayData {
  id: string;
  timestamp: number;
  playerName: string;
  enemyName: string;
  difficulty: Difficulty;
  outcome: BattleOutcome;
  totalTurns: number;
  events: RoundEvent[];
}
