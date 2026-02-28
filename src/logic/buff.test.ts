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
    isDefending: false,
    buffs: [],
    ...overrides,
  };
}

describe("getEffectiveStat", () => {
  it("버프가 없으면 기본 스탯을 반환한다", () => {
    expect(getEffectiveStat(makeCharacter(), "atk")).toBe(20);
  });

  it("버프 값을 합산한다", () => {
    const c = makeCharacter({
      buffs: [{ target: "atk", value: 5, remainingTurns: 2 }],
    });
    expect(getEffectiveStat(c, "atk")).toBe(25);
  });

  it("디버프로 스탯이 감소한다", () => {
    const c = makeCharacter({
      buffs: [{ target: "def", value: -8, remainingTurns: 1 }],
    });
    expect(getEffectiveStat(c, "def")).toBe(2);
  });

  it("최소 1 이하로 내려가지 않는다", () => {
    const c = makeCharacter({
      buffs: [{ target: "atk", value: -100, remainingTurns: 1 }],
    });
    expect(getEffectiveStat(c, "atk")).toBe(1);
  });
});

describe("applyBuff", () => {
  it("새 버프를 추가한다", () => {
    const c = applyBuff(makeCharacter(), "atk", 5, 3);
    expect(c.buffs).toHaveLength(1);
    expect(c.buffs[0]).toEqual({
      target: "atk",
      value: 5,
      remainingTurns: 3,
    });
  });
});

describe("tickBuffs", () => {
  it("남은 턴을 1 감소시킨다", () => {
    const c = makeCharacter({
      buffs: [{ target: "atk", value: 5, remainingTurns: 3 }],
    });
    const ticked = tickBuffs(c);
    expect(ticked.buffs[0].remainingTurns).toBe(2);
  });

  it("남은 턴이 0이 되면 제거한다", () => {
    const c = makeCharacter({
      buffs: [{ target: "atk", value: 5, remainingTurns: 1 }],
    });
    const ticked = tickBuffs(c);
    expect(ticked.buffs).toHaveLength(0);
  });
});
