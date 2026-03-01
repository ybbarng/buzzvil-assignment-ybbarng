import { describe, expect, it } from "vitest";
import { getPresetsByRole, HERO_PRESETS } from "@/constants/presets";
import { STAT_RANGES, TOTAL_POINTS } from "@/constants/stats";
import type { StatKey } from "@/types/character";

describe("HERO_PRESETS", () => {
  it("모든 영웅의 스탯 총합이 200이어야 한다", () => {
    for (const hero of HERO_PRESETS) {
      const total = Object.values(hero.stats).reduce((a, b) => a + b, 0);
      expect(total, `${hero.name}(${hero.id})의 총합이 ${total}`).toBe(
        TOTAL_POINTS,
      );
    }
  });

  it("모든 스탯이 허용 범위 내에 있어야 한다", () => {
    for (const hero of HERO_PRESETS) {
      for (const [key, value] of Object.entries(hero.stats)) {
        const range = STAT_RANGES[key as StatKey];
        expect(
          value,
          `${hero.name}의 ${key}=${value}이 범위 [${range.min}, ${range.max}] 밖`,
        ).toBeGreaterThanOrEqual(range.min);
        expect(
          value,
          `${hero.name}의 ${key}=${value}이 범위 [${range.min}, ${range.max}] 밖`,
        ).toBeLessThanOrEqual(range.max);
      }
    }
  });

  it("모든 영웅의 id가 고유해야 한다", () => {
    const ids = HERO_PRESETS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("역할군별 인원 수가 올바르다", () => {
    const tanks = getPresetsByRole("tank");
    const damage = getPresetsByRole("damage");
    const support = getPresetsByRole("support");

    expect(tanks.length).toBe(14);
    expect(damage.length).toBe(22);
    expect(support.length).toBe(14);
    expect(tanks.length + damage.length + support.length).toBe(
      HERO_PRESETS.length,
    );
  });

  it("getPresetsByRole이 해당 역할만 반환한다", () => {
    const tanks = getPresetsByRole("tank");
    expect(tanks.every((h) => h.role === "tank")).toBe(true);

    const damage = getPresetsByRole("damage");
    expect(damage.every((h) => h.role === "damage")).toBe(true);

    const support = getPresetsByRole("support");
    expect(support.every((h) => h.role === "support")).toBe(true);
  });
});
