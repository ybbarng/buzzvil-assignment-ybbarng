import { describe, expect, it } from "vitest";
import type { BattleLogEntry } from "@/types/battle";
import { type BattleStats, computeBattleStats } from "./battle-stats";

function entry(
  overrides: Partial<BattleLogEntry> & Pick<BattleLogEntry, "actor">,
): BattleLogEntry {
  return {
    round: 1,
    skillName: "테스트",
    skillType: "attack",
    value: 0,
    ...overrides,
  };
}

describe("computeBattleStats", () => {
  it("빈 로그에서 모든 통계가 0이다", () => {
    const result = computeBattleStats([], "용사");
    expect(result).toEqual<BattleStats>({
      damageDealt: 0,
      damageReceived: 0,
      healingDone: 0,
      skillsUsed: 0,
    });
  });

  it("공격 로그에서 가한 데미지를 합산한다", () => {
    const logs: BattleLogEntry[] = [
      entry({ actor: "용사", skillType: "attack", value: 30 }),
      entry({ actor: "용사", skillType: "attack", value: 25 }),
    ];
    const result = computeBattleStats(logs, "용사");
    expect(result.damageDealt).toBe(55);
    expect(result.skillsUsed).toBe(2);
  });

  it("상대의 공격 로그에서 받은 데미지를 합산한다", () => {
    const logs: BattleLogEntry[] = [
      entry({ actor: "적", skillType: "attack", value: 20 }),
      entry({ actor: "적", skillType: "attack", value: 15 }),
    ];
    const result = computeBattleStats(logs, "용사");
    expect(result.damageReceived).toBe(35);
  });

  it("회복 로그에서 회복량을 합산한다", () => {
    const logs: BattleLogEntry[] = [
      entry({ actor: "용사", skillType: "heal", value: 40 }),
    ];
    const result = computeBattleStats(logs, "용사");
    expect(result.healingDone).toBe(40);
    expect(result.skillsUsed).toBe(1);
  });

  it("방어/버프/디버프는 스킬 사용 횟수에만 포함된다", () => {
    const logs: BattleLogEntry[] = [
      entry({ actor: "용사", skillType: "defend", value: 0 }),
      entry({ actor: "용사", skillType: "buff", value: 10 }),
      entry({ actor: "용사", skillType: "debuff", value: 5 }),
    ];
    const result = computeBattleStats(logs, "용사");
    expect(result.damageDealt).toBe(0);
    expect(result.healingDone).toBe(0);
    expect(result.skillsUsed).toBe(3);
  });

  it("혼합 로그에서 올바르게 분류한다", () => {
    const logs: BattleLogEntry[] = [
      entry({ actor: "용사", skillType: "attack", value: 50 }),
      entry({ actor: "적", skillType: "attack", value: 30 }),
      entry({ actor: "용사", skillType: "heal", value: 20 }),
      entry({ actor: "적", skillType: "heal", value: 15 }),
      entry({ actor: "용사", skillType: "buff", value: 10 }),
    ];
    const result = computeBattleStats(logs, "용사");
    expect(result).toEqual<BattleStats>({
      damageDealt: 50,
      damageReceived: 30,
      healingDone: 20,
      skillsUsed: 3,
    });
  });
});
