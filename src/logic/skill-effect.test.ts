import { describe, expect, it } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import { resolveSkillEffect } from "./skill-effect";

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

describe("resolveSkillEffect", () => {
  it("attack: 대상 HP를 감소시키고 MP를 소비한다", () => {
    const user = makeCharacter();
    const target = makeCharacter();
    const result = resolveSkillEffect(user, target, {
      name: "강타",
      type: "attack",
      mpCost: 10,
      multiplier: 1.5,
      isDefault: false,
    });
    expect(result.target.currentHp).toBeLessThan(100);
    expect(result.user.currentMp).toBe(40);
  });

  it("heal: 사용자 HP를 회복하고 최대 HP를 초과하지 않는다", () => {
    const user = makeCharacter({ currentHp: 50 });
    const target = makeCharacter();
    const result = resolveSkillEffect(user, target, {
      name: "회복",
      type: "heal",
      mpCost: 15,
      healAmount: 80,
      isDefault: false,
    });
    expect(result.user.currentHp).toBe(100);
    expect(result.user.currentMp).toBe(35);
  });

  it("buff: 사용자에게 버프를 추가한다", () => {
    const user = makeCharacter();
    const target = makeCharacter();
    const result = resolveSkillEffect(user, target, {
      name: "강화",
      type: "buff",
      mpCost: 10,
      target: "atk",
      value: 5,
      duration: 3,
      isDefault: false,
    });
    expect(result.user.buffs).toHaveLength(1);
    expect(result.user.buffs[0].value).toBe(5);
    expect(result.user.currentMp).toBe(40);
  });

  it("debuff: 대상에게 디버프를 추가한다", () => {
    const user = makeCharacter();
    const target = makeCharacter();
    const result = resolveSkillEffect(user, target, {
      name: "약화",
      type: "debuff",
      mpCost: 10,
      target: "def",
      value: 5,
      duration: 2,
      isDefault: false,
    });
    expect(result.target.buffs).toHaveLength(1);
    expect(result.target.buffs[0].value).toBe(-5);
    expect(result.user.currentMp).toBe(40);
  });

  it("defend: 상태를 변경하지 않는다", () => {
    const user = makeCharacter();
    const target = makeCharacter();
    const result = resolveSkillEffect(user, target, {
      name: "방어",
      type: "defend",
      mpCost: 0,
      isDefault: true,
    });
    expect(result.user).toBe(user);
    expect(result.target).toBe(target);
  });
});
