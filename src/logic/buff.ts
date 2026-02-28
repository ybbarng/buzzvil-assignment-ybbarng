import type { ActiveBuff, BattleCharacter } from "@/types/battle";
import type { BuffTarget } from "@/types/skill";

export function getEffectiveStat(
  character: BattleCharacter,
  stat: BuffTarget,
): number {
  const base = character.baseStats[stat];
  const buffTotal = character.buffs
    .filter((b) => b.target === stat)
    .reduce((sum, b) => sum + b.value, 0);
  return Math.max(1, base + buffTotal);
}

export function applyBuff(
  character: BattleCharacter,
  target: BuffTarget,
  value: number,
  duration: number,
): BattleCharacter {
  const buff: ActiveBuff = { target, value, remainingTurns: duration };
  return { ...character, buffs: [...character.buffs, buff] };
}

export function tickBuffs(character: BattleCharacter): BattleCharacter {
  const updated = character.buffs
    .map((b) => ({ ...b, remainingTurns: b.remainingTurns - 1 }))
    .filter((b) => b.remainingTurns > 0);
  return { ...character, buffs: updated };
}
