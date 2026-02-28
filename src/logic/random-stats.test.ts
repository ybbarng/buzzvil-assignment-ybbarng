import { afterEach, describe, expect, it, vi } from "vitest";
import { STAT_KEYS, STAT_RANGES, TOTAL_POINTS } from "@/constants/stats";
import { generateRandomStats } from "./random-stats";

function expectValidStats(stats: ReturnType<typeof generateRandomStats>) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  expect(total).toBe(TOTAL_POINTS);
  for (const key of STAT_KEYS) {
    const { min, max } = STAT_RANGES[key];
    expect(stats[key]).toBeGreaterThanOrEqual(min);
    expect(stats[key]).toBeLessThanOrEqual(max);
  }
}

describe("generateRandomStats", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("총합이 정확히 TOTAL_POINTS(200)이어야 한다", () => {
    expectValidStats(generateRandomStats());
  });

  it("각 스탯이 STAT_RANGES의 min/max 범위 내여야 한다", () => {
    expectValidStats(generateRandomStats());
  });

  it("100회 반복 실행해도 항상 유효한 스탯을 생성한다", () => {
    for (let i = 0; i < 100; i++) {
      expectValidStats(generateRandomStats());
    }
  });

  it("Math.random이 항상 0을 반환해도 유효한 스탯을 생성한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expectValidStats(generateRandomStats());
  });

  it("Math.random이 항상 최대에 가까운 값을 반환해도 유효한 스탯을 생성한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expectValidStats(generateRandomStats());
  });
});
