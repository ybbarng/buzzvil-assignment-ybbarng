import { describe, expect, it } from "vitest";
import { STAT_RANGES, TOTAL_POINTS } from "@/constants/stats";
import type { StatKey } from "@/types/character";
import { generateRandomStats } from "./random-stats";

const STAT_KEYS: StatKey[] = ["hp", "mp", "atk", "def", "spd"];

describe("generateRandomStats", () => {
  it("총합이 정확히 TOTAL_POINTS(200)이어야 한다", () => {
    const stats = generateRandomStats();
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    expect(total).toBe(TOTAL_POINTS);
  });

  it("각 스탯이 STAT_RANGES의 min/max 범위 내여야 한다", () => {
    const stats = generateRandomStats();
    for (const key of STAT_KEYS) {
      const { min, max } = STAT_RANGES[key];
      expect(stats[key]).toBeGreaterThanOrEqual(min);
      expect(stats[key]).toBeLessThanOrEqual(max);
    }
  });

  it("100회 반복 실행해도 항상 유효한 스탯을 생성한다", () => {
    for (let i = 0; i < 100; i++) {
      const stats = generateRandomStats();
      const total = Object.values(stats).reduce((a, b) => a + b, 0);
      expect(total).toBe(TOTAL_POINTS);
      for (const key of STAT_KEYS) {
        const { min, max } = STAT_RANGES[key];
        expect(stats[key]).toBeGreaterThanOrEqual(min);
        expect(stats[key]).toBeLessThanOrEqual(max);
      }
    }
  });
});
