import type { BattleCharacter } from "@/types/battle";

export function determineFirstMover(
  player: BattleCharacter,
  enemy: BattleCharacter,
): "player" | "enemy" {
  const playerSpd = player.baseStats.spd;
  const enemySpd = enemy.baseStats.spd;
  if (playerSpd > enemySpd) return "player";
  if (enemySpd > playerSpd) return "enemy";
  return Math.random() < 0.5 ? "player" : "enemy";
}
