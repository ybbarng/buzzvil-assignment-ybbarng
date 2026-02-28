import { describe, expect, it } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import { calculateDamage } from "./damage";

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

describe("calculateDamage", () => {
  it("기본 데미지를 계산한다 (ATK * 배율 - DEF * 0.5)", () => {
    const attacker = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    });
    const defender = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 10, def: 10, spd: 10 },
    });
    // 20 * 1.0 - 10 * 0.5 = 15
    expect(calculateDamage(attacker, defender, 1.0)).toBe(15);
  });

  it("방어 중일 때 데미지가 50% 감소한다", () => {
    const attacker = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    });
    const defender = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 10, def: 10, spd: 10 },
      isDefending: true,
    });
    // (20 * 1.0 - 10 * 0.5) * 0.5 = 7.5 -> 7
    expect(calculateDamage(attacker, defender, 1.0)).toBe(7);
  });

  it("배율이 적용된다", () => {
    const attacker = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    });
    const defender = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 10, def: 10, spd: 10 },
    });
    // 20 * 1.5 - 10 * 0.5 = 25
    expect(calculateDamage(attacker, defender, 1.5)).toBe(25);
  });

  it("최소 데미지 1이 보장된다", () => {
    const attacker = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 5, def: 10, spd: 10 },
    });
    const defender = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 10, def: 30, spd: 10 },
    });
    // 5 * 1.0 - 30 * 0.5 = -10 -> min 1
    expect(calculateDamage(attacker, defender, 1.0)).toBe(1);
  });

  it("버프/디버프가 반영된 유효 스탯으로 계산한다", () => {
    const attacker = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
      buffs: [{ target: "atk", value: 5, remainingTurns: 3, isDebuff: false }],
    });
    const defender = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 10, def: 10, spd: 10 },
    });
    // (20+5) * 1.0 - 10 * 0.5 = 20
    expect(calculateDamage(attacker, defender, 1.0)).toBe(20);
  });
});
