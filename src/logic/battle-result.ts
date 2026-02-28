import { MAX_ROUNDS } from "@/constants/battle";
import type { BattleCharacter } from "@/types/battle";
import type { BattleOutcome } from "@/types/game";

export function checkBattleEnd(
  player: BattleCharacter,
  enemy: BattleCharacter,
  round: number,
): BattleOutcome | null {
  if (enemy.currentHp <= 0) return "win";
  if (player.currentHp <= 0) return "lose";
  if (round > MAX_ROUNDS) return "draw";
  return null;
}
