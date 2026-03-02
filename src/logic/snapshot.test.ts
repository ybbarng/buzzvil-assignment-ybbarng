import { describe, expect, it } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import { toSnapshot } from "./snapshot";

function makeCharacter(
  overrides: Partial<BattleCharacter> = {},
): BattleCharacter {
  return {
    name: "테스터",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
    currentHp: 80,
    currentMp: 40,
    skills: [
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
    ],
    isDefending: true,
    buffs: [{ target: "atk", value: 5, remainingTurns: 2 }],
    ...overrides,
  };
}

describe("toSnapshot", () => {
  it("BattleCharacter의 모든 필드를 포함한 스냅샷을 생성한다", () => {
    const char = makeCharacter();
    const snapshot = toSnapshot(char);

    expect(snapshot.name).toBe("테스터");
    expect(snapshot.baseStats).toEqual({
      hp: 100,
      mp: 50,
      atk: 20,
      def: 10,
      spd: 15,
    });
    expect(snapshot.currentHp).toBe(80);
    expect(snapshot.currentMp).toBe(40);
    expect(snapshot.isDefending).toBe(true);
    expect(snapshot.buffs).toEqual([
      { target: "atk", value: 5, remainingTurns: 2 },
    ]);
  });

  it("baseStats를 깊은 복사한다", () => {
    const char = makeCharacter();
    const snapshot = toSnapshot(char);

    snapshot.baseStats.atk = 999;
    expect(char.baseStats.atk).toBe(20);
  });

  it("buffs를 깊은 복사한다", () => {
    const char = makeCharacter();
    const snapshot = toSnapshot(char);

    snapshot.buffs[0].remainingTurns = 99;
    expect(char.buffs[0].remainingTurns).toBe(2);
  });
});
