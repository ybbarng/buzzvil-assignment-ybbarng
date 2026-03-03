import { describe, expect, it } from "vitest";
import type { CharacterSnapshot } from "@/types/battle";
import type { RoundEvent, SkillEffectEvent } from "@/types/battle-event";
import { type BattleStats, computeBattleStats } from "./battle-stats";

const DUMMY_SNAPSHOT: CharacterSnapshot = {
  name: "",
  baseStats: { hp: 100, mp: 50, atk: 10, def: 10, spd: 10 },
  currentHp: 100,
  currentMp: 50,
  isDefending: false,
  buffs: [],
};

function effect(
  overrides: Partial<SkillEffectEvent> &
    Pick<SkillEffectEvent, "actorName" | "targetName">,
): SkillEffectEvent {
  return {
    type: "skill-effect",
    round: 1,
    actor: "player",
    skillName: "테스트",
    skillType: "attack",
    value: 0,
    playerSnapshot: DUMMY_SNAPSHOT,
    enemySnapshot: DUMMY_SNAPSHOT,
    ...overrides,
  };
}

describe("computeBattleStats", () => {
  it("빈 이벤트에서 모든 통계가 0이다", () => {
    const result = computeBattleStats([], "용사");
    expect(result).toEqual<BattleStats>({
      damageDealt: 0,
      damageMitigated: 0,
      healingDone: 0,
      skillsUsed: 0,
    });
  });

  it("공격 이벤트에서 가한 대미지를 합산한다", () => {
    const events: RoundEvent[] = [
      effect({
        actorName: "용사",
        targetName: "적",
        skillType: "attack",
        value: 30,
      }),
      effect({
        actorName: "용사",
        targetName: "적",
        skillType: "attack",
        value: 25,
      }),
    ];
    const result = computeBattleStats(events, "용사");
    expect(result.damageDealt).toBe(55);
    expect(result.skillsUsed).toBe(2);
  });

  it("방어 중 받은 공격의 경감 대미지를 합산한다", () => {
    const events: RoundEvent[] = [
      // 라운드 1: 용사가 방어
      {
        type: "defend",
        round: 1,
        actor: "player",
        actorName: "용사",
        playerSnapshot: DUMMY_SNAPSHOT,
        enemySnapshot: DUMMY_SNAPSHOT,
      },
      effect({
        round: 1,
        actor: "enemy",
        actorName: "적",
        targetName: "용사",
        skillType: "attack",
        value: 10,
      }),
      // 라운드 2: 방어 없이 공격 → 경감 없음
      effect({
        round: 2,
        actor: "enemy",
        actorName: "적",
        targetName: "용사",
        skillType: "attack",
        value: 20,
      }),
    ];
    const result = computeBattleStats(events, "용사");
    expect(result.damageMitigated).toBe(10);
  });

  it("회복 이벤트에서 회복량을 합산한다", () => {
    const events: RoundEvent[] = [
      effect({
        actorName: "용사",
        targetName: "용사",
        skillType: "heal",
        value: 40,
      }),
    ];
    const result = computeBattleStats(events, "용사");
    expect(result.healingDone).toBe(40);
    expect(result.skillsUsed).toBe(1);
  });

  it("방어/버프/디버프는 스킬 사용 횟수에만 포함된다", () => {
    const events: RoundEvent[] = [
      effect({
        actorName: "용사",
        targetName: "용사",
        skillType: "defend",
        value: 0,
      }),
      effect({
        actorName: "용사",
        targetName: "용사",
        skillType: "buff",
        value: 10,
      }),
      effect({
        actorName: "용사",
        targetName: "적",
        skillType: "debuff",
        value: 5,
      }),
    ];
    const result = computeBattleStats(events, "용사");
    expect(result.damageDealt).toBe(0);
    expect(result.healingDone).toBe(0);
    expect(result.skillsUsed).toBe(3);
  });

  it("혼합 이벤트에서 올바르게 분류한다", () => {
    const events: RoundEvent[] = [
      // 라운드 1: 용사 방어 + 적 공격
      {
        type: "defend",
        round: 1,
        actor: "player",
        actorName: "용사",
        playerSnapshot: DUMMY_SNAPSHOT,
        enemySnapshot: DUMMY_SNAPSHOT,
      },
      effect({
        round: 1,
        actor: "enemy",
        actorName: "적",
        targetName: "용사",
        skillType: "attack",
        value: 15,
      }),
      // 라운드 2: 용사 공격 + 적 공격 (방어 없음)
      effect({
        round: 2,
        actorName: "용사",
        targetName: "적",
        skillType: "attack",
        value: 50,
      }),
      effect({
        round: 2,
        actor: "enemy",
        actorName: "적",
        targetName: "용사",
        skillType: "attack",
        value: 30,
      }),
      // 라운드 3: 회복 + 버프
      effect({
        round: 3,
        actorName: "용사",
        targetName: "용사",
        skillType: "heal",
        value: 20,
      }),
      effect({
        round: 3,
        actorName: "용사",
        targetName: "용사",
        skillType: "buff",
        value: 10,
      }),
    ];
    const result = computeBattleStats(events, "용사");
    expect(result).toEqual<BattleStats>({
      damageDealt: 50,
      damageMitigated: 15,
      healingDone: 20,
      skillsUsed: 3,
    });
  });

  it("skill-effect 외 이벤트는 무시한다", () => {
    const events: RoundEvent[] = [
      {
        type: "round-start",
        round: 1,
        playerSnapshot: DUMMY_SNAPSHOT,
        enemySnapshot: DUMMY_SNAPSHOT,
      },
      effect({
        actorName: "용사",
        targetName: "적",
        skillType: "attack",
        value: 50,
      }),
      {
        type: "battle-end",
        round: 1,
        outcome: "win",
        playerSnapshot: DUMMY_SNAPSHOT,
        enemySnapshot: DUMMY_SNAPSHOT,
      },
    ];
    const result = computeBattleStats(events, "용사");
    expect(result.damageDealt).toBe(50);
    expect(result.skillsUsed).toBe(1);
  });
});
