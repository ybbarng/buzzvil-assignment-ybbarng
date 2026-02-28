import type { ActiveBuff, BattleCharacter } from "@/types/battle";

export function getEffectiveStat(
  character: BattleCharacter,
  stat: "atk" | "def",
): number {
  const base = character.baseStats[stat];
  const modifier = character.buffs
    .filter((b) => b.target === stat)
    .reduce((sum, b) => sum + (b.isDebuff ? -b.value : b.value), 0);
  return Math.max(0, base + modifier);
}

export function tickBuffs(buffs: ActiveBuff[]): ActiveBuff[] {
  return buffs
    .map((b) => ({ ...b, remainingTurns: b.remainingTurns - 1 }))
    .filter((b) => b.remainingTurns > 0);
}

export function applyBuff(
  buffs: ActiveBuff[],
  target: "atk" | "def",
  value: number,
  duration: number,
  isDebuff: boolean,
): ActiveBuff[] {
  return [...buffs, { target, value, remainingTurns: duration, isDebuff }];
}
