import { describe, expect, it } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import { createLogEntry } from "./battle-log";

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

describe("createLogEntry", () => {
  it("attack: 데미지 값을 기록한다", () => {
    const actor = makeCharacter({ name: "플레이어" });
    const target = makeCharacter({ name: "적", currentHp: 80 });
    const targetAfter = makeCharacter({ name: "적", currentHp: 65 });

    const log = createLogEntry(
      1,
      actor,
      target,
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      actor,
      targetAfter,
    );

    expect(log.skillType).toBe("attack");
    expect(log.value).toBe(15);
    expect(log.actor).toBe("플레이어");
  });

  it("heal: 회복량을 기록한다", () => {
    const actor = makeCharacter({ name: "적", currentHp: 50 });
    const actorAfter = makeCharacter({ name: "적", currentHp: 80 });
    const target = makeCharacter();

    const log = createLogEntry(
      2,
      actor,
      target,
      {
        name: "회복",
        type: "heal",
        mpCost: 15,
        healAmount: 30,
        isDefault: false,
      },
      actorAfter,
      target,
    );

    expect(log.skillType).toBe("heal");
    expect(log.value).toBe(30);
  });

  it("defend: value가 0이다", () => {
    const actor = makeCharacter();
    const target = makeCharacter();

    const log = createLogEntry(
      1,
      actor,
      target,
      { name: "방어", type: "defend", mpCost: 0, isDefault: true },
      actor,
      target,
    );

    expect(log.skillType).toBe("defend");
    expect(log.value).toBe(0);
  });

  it("debuff: 스킬 value를 기록한다", () => {
    const actor = makeCharacter();
    const target = makeCharacter();

    const log = createLogEntry(
      3,
      actor,
      target,
      {
        name: "약화",
        type: "debuff",
        mpCost: 15,
        target: "def",
        value: 5,
        duration: 2,
        isDefault: false,
      },
      actor,
      target,
    );

    expect(log.skillType).toBe("debuff");
    expect(log.value).toBe(5);
  });
});
