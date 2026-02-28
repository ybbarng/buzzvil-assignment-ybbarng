import { afterEach, describe, expect, it, vi } from "vitest";
import { useBattleStore } from "./battle-store";

function getPlayer() {
  const player = useBattleStore.getState().player;
  if (!player) throw new Error("player is not initialized");
  return player;
}

function getEnemy() {
  const enemy = useBattleStore.getState().enemy;
  if (!enemy) throw new Error("enemy is not initialized");
  return enemy;
}

describe("battle-store", () => {
  afterEach(() => {
    useBattleStore.getState().reset();
    vi.restoreAllMocks();
  });

  it("initBattle로 전투를 초기화한다", () => {
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    const state = useBattleStore.getState();

    expect(state.player?.name).toBe("테스터");
    expect(state.player?.currentHp).toBe(100);
    expect(state.enemy?.name).toBe("훈련 로봇");
    expect(state.round).toBe(1);
    expect(state.outcome).toBeNull();
  });

  it("공격 시 적 HP가 감소한다", () => {
    // SPD를 높게 해서 플레이어가 선공하도록
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 99 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    const enemyHpBefore = getEnemy().currentHp;

    useBattleStore.getState().executePlayerAction(0); // 공격

    const enemyHpAfter = getEnemy().currentHp;
    expect(enemyHpAfter).toBeLessThan(enemyHpBefore);
  });

  it("방어 후 받는 데미지가 감소한다", () => {
    // SPD를 낮게 해서 적이 선공하도록
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 1 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    // 공격 시 받는 데미지
    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    useBattleStore.getState().executePlayerAction(0);
    const hpAfterAttack = getPlayer().currentHp;
    const damageWithoutDefend = 100 - hpAfterAttack;

    // 방어 시 받는 데미지
    useBattleStore.getState().reset();
    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    useBattleStore.getState().executePlayerAction(1);
    const hpAfterDefend = getPlayer().currentHp;
    const damageWithDefend = 100 - hpAfterDefend;

    expect(damageWithDefend).toBeLessThan(damageWithoutDefend);
  });

  it("라운드가 진행된다", () => {
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    useBattleStore.getState().executePlayerAction(0);

    expect(useBattleStore.getState().round).toBe(2);
  });
});
