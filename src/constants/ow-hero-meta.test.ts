import { describe, expect, it } from "vitest";
import {
  generateAllHeroPresets,
  OW_HERO_STAT_META,
  SUB_ROLE_BASE_STATS,
} from "@/constants/ow-hero-meta";
import { ROLE_SUB_ROLES } from "@/constants/presets";
import { STAT_RANGES, TOTAL_POINTS } from "@/constants/stats";
import type { StatKey } from "@/types/character";

describe("SUB_ROLE_BASE_STATS", () => {
  it("모든 서브역할군의 기본 스탯 총합이 200이다", () => {
    for (const [subRole, stats] of Object.entries(SUB_ROLE_BASE_STATS)) {
      const total = Object.values(stats).reduce((a, b) => a + b, 0);
      expect(total, `${subRole}의 총합이 ${total}`).toBe(TOTAL_POINTS);
    }
  });

  it("모든 서브역할군의 기본 스탯이 허용 범위 내에 있다", () => {
    for (const [subRole, stats] of Object.entries(SUB_ROLE_BASE_STATS)) {
      for (const [key, value] of Object.entries(stats)) {
        const range = STAT_RANGES[key as StatKey];
        expect(
          value,
          `${subRole}의 ${key}=${value}이 범위 밖`,
        ).toBeGreaterThanOrEqual(range.min);
        expect(
          value,
          `${subRole}의 ${key}=${value}이 범위 밖`,
        ).toBeLessThanOrEqual(range.max);
      }
    }
  });

  it("모든 역할군의 서브역할군이 포함되어 있다", () => {
    for (const subRoles of Object.values(ROLE_SUB_ROLES)) {
      for (const subRole of subRoles) {
        expect(SUB_ROLE_BASE_STATS[subRole]).toBeDefined();
      }
    }
  });
});

describe("OW_HERO_STAT_META", () => {
  it("50명 영웅이 모두 포함되어 있다", () => {
    expect(OW_HERO_STAT_META.length).toBe(50);
  });

  it("heroId에 중복이 없다", () => {
    const ids = OW_HERO_STAT_META.map((h) => h.heroId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 영웅의 조정값 합계가 0이다", () => {
    for (const hero of OW_HERO_STAT_META) {
      const adj = hero.adjustments;
      const total = adj.hp + adj.mp + adj.atk + adj.def + adj.spd;
      expect(
        total,
        `${hero.name}(${hero.heroId})의 조정값 합계가 ${total}`,
      ).toBe(0);
    }
  });

  it("모든 영웅의 서브역할군이 역할군에 유효하다", () => {
    for (const hero of OW_HERO_STAT_META) {
      const validSubRoles = ROLE_SUB_ROLES[hero.role];
      expect(
        validSubRoles,
        `${hero.name}의 subRole '${hero.subRole}'이 역할군 '${hero.role}'에 유효하지 않음`,
      ).toContain(hero.subRole);
    }
  });
});

describe("generateAllHeroPresets", () => {
  const generated = generateAllHeroPresets();

  it("생성된 프리셋 수가 메타데이터 수와 같다", () => {
    expect(generated.length).toBe(OW_HERO_STAT_META.length);
  });

  it("생성된 프리셋의 스탯 총합이 모두 200이다", () => {
    for (const preset of generated) {
      const total = Object.values(preset.stats).reduce((a, b) => a + b, 0);
      expect(total, `${preset.name}의 총합이 ${total}`).toBe(TOTAL_POINTS);
    }
  });

  it("생성된 프리셋의 모든 스탯이 허용 범위 내에 있다", () => {
    for (const preset of generated) {
      for (const [key, value] of Object.entries(preset.stats)) {
        const range = STAT_RANGES[key as StatKey];
        expect(
          value,
          `${preset.name}의 ${key}=${value}이 범위 밖`,
        ).toBeGreaterThanOrEqual(range.min);
        expect(
          value,
          `${preset.name}의 ${key}=${value}이 범위 밖`,
        ).toBeLessThanOrEqual(range.max);
      }
    }
  });

  it("대표 영웅의 base + adjustments 계산이 정확하다", () => {
    const dva = generated.find((g) => g.id === "dva");
    // initiator base { hp:82, mp:45, atk:18, def:25, spd:30 } + adj { 3, -3, -2, 2, 0 }
    expect(dva?.stats).toEqual({ hp: 85, mp: 42, atk: 16, def: 27, spd: 30 });

    const genji = generated.find((g) => g.id === "genji");
    // flanker base { hp:50, mp:82, atk:28, def:10, spd:30 } + adj { -4, 0, 2, 2, 0 }
    expect(genji?.stats).toEqual({
      hp: 46,
      mp: 82,
      atk: 30,
      def: 12,
      spd: 30,
    });
  });
});
