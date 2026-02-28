import { describe, expect, it } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import { applyBuff, getEffectiveStat, tickBuffs } from "./buff";

function makeCharacter(
  overrides: Partial<BattleCharacter> = {},
): BattleCharacter {
  return {
    name: "테스트",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    currentHp: 100,
    currentMp: 50,
    skills: [],
    buffs: [],
    isDefending: false,
    ...overrides,
  };
}

describe("getEffectiveStat", () => {
  it("버프가 없으면 기본값을 반환한다", () => {
    const char = makeCharacter();
    expect(getEffectiveStat(char, "atk")).toBe(20);
  });

  it("버프가 있으면 가산한다", () => {
    const char = makeCharacter({
      buffs: [{ target: "atk", value: 5, remainingTurns: 3, isDebuff: false }],
    });
    expect(getEffectiveStat(char, "atk")).toBe(25);
  });

  it("디버프가 있으면 감산한다", () => {
    const char = makeCharacter({
      buffs: [{ target: "def", value: 5, remainingTurns: 2, isDebuff: true }],
    });
    expect(getEffectiveStat(char, "def")).toBe(5);
  });

  it("유효 스탯은 0 미만이 되지 않는다", () => {
    const char = makeCharacter({
      buffs: [{ target: "atk", value: 30, remainingTurns: 1, isDebuff: true }],
    });
    expect(getEffectiveStat(char, "atk")).toBe(0);
  });
});

describe("tickBuffs", () => {
  it("남은 턴을 1 감소시킨다", () => {
    const buffs = [
      { target: "atk" as const, value: 5, remainingTurns: 3, isDebuff: false },
    ];
    const result = tickBuffs(buffs);
    expect(result[0].remainingTurns).toBe(2);
  });

  it("남은 턴이 0이 되면 제거한다", () => {
    const buffs = [
      { target: "atk" as const, value: 5, remainingTurns: 1, isDebuff: false },
    ];
    const result = tickBuffs(buffs);
    expect(result).toHaveLength(0);
  });
});

describe("applyBuff", () => {
  it("새 버프를 추가한다", () => {
    const buffs = applyBuff([], "atk", 5, 3, false);
    expect(buffs).toHaveLength(1);
    expect(buffs[0]).toEqual({
      target: "atk",
      value: 5,
      remainingTurns: 3,
      isDebuff: false,
    });
  });
});
