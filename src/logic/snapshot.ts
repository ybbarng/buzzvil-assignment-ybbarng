import type { BattleCharacter, CharacterSnapshot } from "@/types/battle";

export function toSnapshot(character: BattleCharacter): CharacterSnapshot {
  return {
    name: character.name,
    baseStats: { ...character.baseStats },
    currentHp: character.currentHp,
    currentMp: character.currentMp,
    isDefending: character.isDefending,
    buffs: character.buffs.map((b) => ({ ...b })),
  };
}
