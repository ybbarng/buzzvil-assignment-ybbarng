import { describe, expect, it, vi } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import type { Skill } from "@/types/skill";
import { decideEnemyAction } from "./enemy-ai";

function makeEnemy(
  overrides: Partial<BattleCharacter> & { skills: Skill[] },
): BattleCharacter {
  return {
    name: "적",
    baseStats: { hp: 100, mp: 50, atk: 15, def: 10, spd: 10 },
    currentHp: 100,
    currentMp: 50,
    isDefending: false,
    buffs: [],
    ...overrides,
  };
}

const basicSkills: Skill[] = [
  {
    name: "공격",
    type: "attack",
    mpCost: 0,
    multiplier: 1.0,
    isDefault: true,
  },
  { name: "방어", type: "defend", mpCost: 0, isDefault: true },
];

describe("decideEnemyAction", () => {
  it("HP가 30% 미만이면 회복 스킬을 선택한다", () => {
    const enemy = makeEnemy({
      currentHp: 20,
      skills: [
        ...basicSkills,
        {
          name: "회복",
          type: "heal",
          mpCost: 15,
          healAmount: 30,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy)).toBe(2);
  });

  it("HP가 낮지만 MP가 부족하면 회복을 선택하지 않는다", () => {
    const enemy = makeEnemy({
      currentHp: 20,
      currentMp: 0,
      skills: [
        ...basicSkills,
        {
          name: "회복",
          type: "heal",
          mpCost: 15,
          healAmount: 30,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy)).toBe(0);
  });

  it("특수 스킬이 없으면 기본 공격을 선택한다", () => {
    const enemy = makeEnemy({ skills: basicSkills });
    expect(decideEnemyAction(enemy)).toBe(0);
  });

  it("Math.random < 0.5이면 특수 스킬을 사용한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.3);
    const enemy = makeEnemy({
      skills: [
        ...basicSkills,
        {
          name: "강타",
          type: "attack",
          mpCost: 15,
          multiplier: 1.5,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy)).toBe(2);
    vi.restoreAllMocks();
  });

  it("Math.random >= 0.5이면 기본 공격을 사용한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.7);
    const enemy = makeEnemy({
      skills: [
        ...basicSkills,
        {
          name: "강타",
          type: "attack",
          mpCost: 15,
          multiplier: 1.5,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy)).toBe(0);
    vi.restoreAllMocks();
  });
});
