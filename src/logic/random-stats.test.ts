import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_STATS,
  STAT_KEYS,
  STAT_RANGES,
  TOTAL_POINTS,
} from "@/constants/stats";
import type { Stats } from "@/types/character";
import { distributeRemainingStats } from "./random-stats";

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
