import { describe, expect, it } from "vitest";
import {
  generateAllHeroPresets,
  OW_HERO_STAT_META,
  SUB_ROLE_BASE_STATS,
} from "@/constants/ow-hero-meta";
import { HERO_PRESETS, ROLE_SUB_ROLES } from "@/constants/presets";
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

  it("모든 영웅에 rationale이 있다", () => {
    for (const hero of OW_HERO_STAT_META) {
      expect(
        hero.rationale.length,
        `${hero.name}의 rationale이 비어 있음`,
      ).toBeGreaterThan(0);
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

  it("HERO_PRESETS의 모든 heroId에 대응하는 메타데이터가 존재한다", () => {
    const metaIds = new Set(OW_HERO_STAT_META.map((h) => h.heroId));
    for (const preset of HERO_PRESETS) {
      expect(
        metaIds.has(preset.id),
        `${preset.name}(${preset.id})의 메타데이터가 없음`,
      ).toBe(true);
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

  it("생성된 프리셋이 기존 HERO_PRESETS와 정확히 일치한다", () => {
    for (const preset of HERO_PRESETS) {
      const gen = generated.find((g) => g.id === preset.id);
      expect(gen, `${preset.name}(${preset.id}) 생성 결과 없음`).toBeDefined();
      expect(gen?.name).toBe(preset.name);
      expect(gen?.role).toBe(preset.role);
      expect(gen?.subRole).toBe(preset.subRole);
      expect(gen?.description).toBe(preset.description);
      expect(gen?.stats).toEqual(preset.stats);
    }
  });
});
