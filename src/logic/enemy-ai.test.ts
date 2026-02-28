import { afterEach, describe, expect, it, vi } from "vitest";
import { ENEMIES } from "@/constants/enemies";
import type { BattleCharacter } from "@/types/battle";
import { decideEnemyAction } from "./enemy-ai";

function makeEnemy(
  difficulty: "easy" | "normal" | "hard",
  overrides: Partial<BattleCharacter> = {},
): BattleCharacter {
  const config = ENEMIES[difficulty];
  return {
    name: config.name,
    baseStats: { ...config.stats },
    currentHp: config.stats.hp,
    currentMp: config.stats.mp,
    skills: config.skills,
    buffs: [],
    isDefending: false,
    ...overrides,
  };
}

function makePlayer(overrides: Partial<BattleCharacter> = {}): BattleCharacter {
  return {
    name: "플레이어",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    currentHp: 100,
    currentMp: 50,
    skills: [],
    buffs: [],
    isDefending: false,
    ...overrides,
  };
}

describe("enemy-ai", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("쉬움", () => {
    it("Math.random < 0.7이면 기본 공격(index 0)을 선택한다", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const result = decideEnemyAction(makeEnemy("easy"), makePlayer(), "easy");
      expect(result).toBe(0);
    });
  });

  describe("보통", () => {
    it("HP 30% 미만이면 회복을 선택한다", () => {
      const enemy = makeEnemy("normal", { currentHp: 20 }); // 20/110 ≈ 18%
      const result = decideEnemyAction(enemy, makePlayer(), "normal");
      // 보통 적의 스킬: [공격, 방어, 강타, 회복] → 회복은 index 3
      expect(result).toBe(3);
    });

    it("HP 30% 미만 + 회복 MP 부족이면 방어를 선택한다", () => {
      const enemy = makeEnemy("normal", { currentHp: 20, currentMp: 0 });
      const result = decideEnemyAction(enemy, makePlayer(), "normal");
      expect(result).toBe(1);
    });
  });

  describe("어려움", () => {
    it("플레이어에게 디버프가 없으면 디버프를 사용한다", () => {
      const enemy = makeEnemy("hard");
      const player = makePlayer({ buffs: [] });
      const result = decideEnemyAction(enemy, player, "hard");
      // 어려움 적의 스킬: [공격, 방어, 강타, 회복, 약화] → 약화는 index 4
      expect(result).toBe(4);
    });

    it("HP 25% 미만이면 회복을 선택한다", () => {
      const enemy = makeEnemy("hard", { currentHp: 30 }); // 30/140 ≈ 21%
      const player = makePlayer();
      const result = decideEnemyAction(enemy, player, "hard");
      // 회복은 index 3
      expect(result).toBe(3);
    });

    it("HP 25% 미만 + 회복 MP 부족이면 방어를 선택한다", () => {
      const enemy = makeEnemy("hard", { currentHp: 30, currentMp: 0 });
      const player = makePlayer();
      const result = decideEnemyAction(enemy, player, "hard");
      expect(result).toBe(1);
    });

    it("디버프가 이미 있고 HP 충분하면 강한 공격을 선택한다", () => {
      const enemy = makeEnemy("hard");
      const player = makePlayer({
        buffs: [{ target: "def", value: 5, remainingTurns: 2, isDebuff: true }],
      });
      const result = decideEnemyAction(enemy, player, "hard");
      // 공격 스킬: [index 0(공격), index 2(강타)] → 강타(마지막) = index 2
      expect(result).toBe(2);
    });
  });
});
