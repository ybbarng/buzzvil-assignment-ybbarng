import {
  DEF_REDUCTION_RATE,
  DEFEND_MULTIPLIER,
  MIN_DAMAGE,
} from "@/constants/battle";
import type { BattleCharacter } from "@/types/battle";

export function calculateDamage(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  multiplier: number,
): number {
  const atk = attacker.baseStats.atk;
  const def = defender.baseStats.def;
  const raw = atk * multiplier - def * DEF_REDUCTION_RATE;
  const afterDefend = raw * (defender.isDefending ? DEFEND_MULTIPLIER : 1.0);
  return Math.max(MIN_DAMAGE, Math.floor(afterDefend));
}
