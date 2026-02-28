import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_STATS,
  STAT_KEYS,
  STAT_RANGES,
  TOTAL_POINTS,
} from "@/constants/stats";
import type { Stats } from "@/types/character";
import {
  clearStat,
  distributeRandomToStat,
  distributeRemainingStats,
} from "./random-stats";

function expectValidStats(stats: Stats) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  expect(total).toBe(TOTAL_POINTS);
  for (const key of STAT_KEYS) {
    const { min, max } = STAT_RANGES[key];
    expect(stats[key]).toBeGreaterThanOrEqual(min);
    expect(stats[key]).toBeLessThanOrEqual(max);
  }
}

describe("distributeRemainingStats", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("기본 스탯에서 남은 포인트를 모두 배분한다", () => {
    expectValidStats(distributeRemainingStats(DEFAULT_STATS));
  });

  it("이미 배분된 스탯 이상의 값을 유지하면서 남은 포인트만 배분한다", () => {
    const partial: Stats = { hp: 80, mp: 60, atk: 5, def: 5, spd: 5 };
    const result = distributeRemainingStats(partial);
    for (const key of STAT_KEYS) {
      expect(result[key]).toBeGreaterThanOrEqual(partial[key]);
    }
    expectValidStats(result);
  });

  it("잔여 포인트가 0이면 스탯이 변하지 않는다", () => {
    const full: Stats = { hp: 100, mp: 60, atk: 20, def: 10, spd: 10 };
    const result = distributeRemainingStats(full);
    expect(result).toEqual(full);
  });

  it("100회 반복 실행해도 항상 유효한 스탯을 생성한다", () => {
    for (let i = 0; i < 100; i++) {
      expectValidStats(distributeRemainingStats(DEFAULT_STATS));
    }
  });

  it("Math.random이 항상 0을 반환해도 유효한 스탯을 생성한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expectValidStats(distributeRemainingStats(DEFAULT_STATS));
  });

  it("Math.random이 항상 최대에 가까운 값을 반환해도 유효한 스탯을 생성한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expectValidStats(distributeRemainingStats(DEFAULT_STATS));
  });
});

describe("distributeRandomToStat", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("대상 스탯에만 포인트를 추가하고 나머지는 유지한다", () => {
    const base: Stats = { hp: 20, mp: 20, atk: 5, def: 5, spd: 5 };
    const result = distributeRandomToStat(base, "hp");
    expect(result.hp).toBeGreaterThanOrEqual(base.hp);
    expect(result.mp).toBe(base.mp);
    expect(result.atk).toBe(base.atk);
    expect(result.def).toBe(base.def);
    expect(result.spd).toBe(base.spd);
  });

  it("결과 총합이 TOTAL_POINTS를 초과하지 않는다", () => {
    const base: Stats = { hp: 50, mp: 50, atk: 20, def: 20, spd: 10 };
    for (let i = 0; i < 100; i++) {
      const result = distributeRandomToStat(base, "atk");
      const total = STAT_KEYS.reduce((s, k) => s + result[k], 0);
      expect(total).toBeLessThanOrEqual(TOTAL_POINTS);
      expect(result.atk).toBeLessThanOrEqual(STAT_RANGES.atk.max);
    }
  });

  it("잔여 포인트가 0이면 스탯이 변하지 않는다", () => {
    const full: Stats = { hp: 100, mp: 60, atk: 20, def: 10, spd: 10 };
    const result = distributeRandomToStat(full, "hp");
    expect(result).toEqual(full);
  });

  it("스탯이 이미 max이면 변하지 않는다", () => {
    const base: Stats = { hp: 100, mp: 20, atk: 5, def: 5, spd: 5 };
    const result = distributeRandomToStat(base, "hp");
    expect(result).toEqual(base);
  });
});

describe("clearStat", () => {
  it("대상 스탯을 min으로 초기화한다", () => {
    const base: Stats = { hp: 80, mp: 60, atk: 20, def: 15, spd: 10 };
    const result = clearStat(base, "hp");
    expect(result.hp).toBe(STAT_RANGES.hp.min);
  });

  it("나머지 스탯은 유지한다", () => {
    const base: Stats = { hp: 80, mp: 60, atk: 20, def: 15, spd: 10 };
    const result = clearStat(base, "hp");
    expect(result.mp).toBe(base.mp);
    expect(result.atk).toBe(base.atk);
    expect(result.def).toBe(base.def);
    expect(result.spd).toBe(base.spd);
  });

  it("이미 min인 스탯을 클리어해도 값이 유지된다", () => {
    const base: Stats = { hp: 20, mp: 20, atk: 5, def: 5, spd: 5 };
    const result = clearStat(base, "atk");
    expect(result).toEqual(base);
  });
});
