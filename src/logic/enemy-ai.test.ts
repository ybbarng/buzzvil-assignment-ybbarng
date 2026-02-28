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

describe("decideEnemyAction - easy", () => {
  it("대부분 기본 공격을 선택한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const enemy = makeEnemy({
      skills: [
        ...basicSkills,
        {
          name: "강타",
          type: "attack",
          mpCost: 8,
          multiplier: 1.3,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "easy")).toBe(0);
    vi.restoreAllMocks();
  });

  it("낮은 확률로 방어를 선택한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const enemy = makeEnemy({ skills: basicSkills });
    expect(decideEnemyAction(enemy, "easy")).toBe(1);
    vi.restoreAllMocks();
  });
});

describe("decideEnemyAction - normal", () => {
  it("HP가 40% 미만이면 회복 스킬을 선택한다", () => {
    const enemy = makeEnemy({
      currentHp: 30,
      skills: [
        ...basicSkills,
        {
          name: "회복",
          type: "heal",
          mpCost: 10,
          healAmount: 20,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "normal")).toBe(2);
  });

  it("HP가 낮지만 MP가 부족하면 방어를 선택한다", () => {
    const enemy = makeEnemy({
      currentHp: 30,
      currentMp: 0,
      skills: [
        ...basicSkills,
        {
          name: "회복",
          type: "heal",
          mpCost: 10,
          healAmount: 20,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "normal")).toBe(1);
  });

  it("50% 확률로 강타를 사용한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.3);
    const enemy = makeEnemy({
      skills: [
        ...basicSkills,
        {
          name: "강타",
          type: "attack",
          mpCost: 10,
          multiplier: 1.5,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "normal")).toBe(2);
    vi.restoreAllMocks();
  });
});

describe("decideEnemyAction - hard", () => {
  it("HP가 30% 미만이면 회복을 선택한다", () => {
    const enemy = makeEnemy({
      currentHp: 20,
      skills: [
        ...basicSkills,
        {
          name: "회복",
          type: "heal",
          mpCost: 12,
          healAmount: 30,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "hard")).toBe(2);
  });

  it("HP가 30% 미만이고 회복 불가능하면 방어를 선택한다", () => {
    const enemy = makeEnemy({
      currentHp: 20,
      currentMp: 0,
      skills: [
        ...basicSkills,
        {
          name: "회복",
          type: "heal",
          mpCost: 12,
          healAmount: 30,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "hard")).toBe(1);
  });

  it("디버프 스킬을 적극적으로 활용한다", () => {
    // random 0.3 → HP 50% 이상이므로 회복 skip → 디버프 60% 확률에 해당
    vi.spyOn(Math, "random").mockReturnValue(0.3);
    const enemy = makeEnemy({
      skills: [
        ...basicSkills,
        {
          name: "약화",
          type: "debuff",
          mpCost: 10,
          target: "def",
          value: 5,
          duration: 3,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "hard")).toBe(2);
    vi.restoreAllMocks();
  });

  it("강타를 높은 확률로 사용한다", () => {
    // 디버프 스킬 없으므로 debuff 분기 skip, 강타 분기에서 0.5 < 0.7 이므로 강타 사용
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const enemy = makeEnemy({
      skills: [
        ...basicSkills,
        {
          name: "강타",
          type: "attack",
          mpCost: 12,
          multiplier: 1.7,
          isDefault: false,
        },
      ],
    });
    expect(decideEnemyAction(enemy, "hard")).toBe(2);
    vi.restoreAllMocks();
  });
});
