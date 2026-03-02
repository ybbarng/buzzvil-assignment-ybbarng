import { describe, expect, it } from "vitest";
import {
  CONVERSION_RULES,
  getOwHeroMetaByHeroId,
  OW_HERO_META,
} from "@/constants/ow-skill-meta";
import { HERO_PRESETS } from "@/constants/presets";
import { SKILL_PRESETS } from "@/constants/skill-presets";

describe("OW_HERO_META", () => {
  it("모든 HERO_PRESETS에 대응하는 메타데이터가 존재한다", () => {
    const metaHeroIds = new Set(OW_HERO_META.map((h) => h.heroId));
    for (const hero of HERO_PRESETS) {
      expect(metaHeroIds.has(hero.id)).toBe(true);
    }
  });

  it("모든 SKILL_PRESETS에 대응하는 메타데이터가 존재한다", () => {
    for (const preset of SKILL_PRESETS) {
      const meta = getOwHeroMetaByHeroId(preset.heroId);
      expect(meta).toBeDefined();
      expect(meta?.skills.length).toBe(preset.skills.length);
    }
  });

  it("메타데이터의 스킬 순서와 프리셋의 스킬 순서가 일치한다", () => {
    for (const preset of SKILL_PRESETS) {
      const meta = getOwHeroMetaByHeroId(preset.heroId);
      if (!meta) continue;
      for (let i = 0; i < preset.skills.length; i++) {
        // 프리셋 이름은 축약일 수 있으므로, 메타 이름이 프리셋 이름을 포함하는지 확인
        const presetName = preset.skills[i].name;
        const metaName = meta.skills[i].name;
        expect(
          metaName.includes(presetName) || presetName.includes(metaName),
        ).toBe(true);
      }
    }
  });

  it("heroId에 중복이 없다", () => {
    const heroIds = OW_HERO_META.map((h) => h.heroId);
    expect(new Set(heroIds).size).toBe(heroIds.length);
  });

  it("각 영웅은 정확히 4개의 스킬 메타를 가진다", () => {
    for (const hero of OW_HERO_META) {
      expect(hero.skills.length).toBe(4);
    }
  });

  it("모든 스킬에 name, category, description이 있다", () => {
    for (const hero of OW_HERO_META) {
      for (const skill of hero.skills) {
        expect(skill.name.length).toBeGreaterThan(0);
        expect(skill.category.length).toBeGreaterThan(0);
        expect(skill.description.length).toBeGreaterThan(0);
      }
    }
  });

  it("같은 영웅 내에 중복 스킬 이름이 없다", () => {
    for (const hero of OW_HERO_META) {
      const names = hero.skills.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

describe("CONVERSION_RULES", () => {
  it("모든 카테고리에 대한 변환 규칙이 존재한다", () => {
    const categories = [
      "ultimate_damage",
      "ultimate_cc",
      "ultimate_heal",
      "ultimate_buff",
      "attack",
      "movement",
      "barrier",
      "healing",
      "self_heal",
      "attack_buff",
      "cc",
    ] as const;
    for (const cat of categories) {
      expect(CONVERSION_RULES[cat]).toBeDefined();
      expect(CONVERSION_RULES[cat].mpCost.min).toBeGreaterThan(0);
      expect(CONVERSION_RULES[cat].mpCost.max).toBeGreaterThanOrEqual(
        CONVERSION_RULES[cat].mpCost.min,
      );
    }
  });

  it("attack 타입 규칙에는 multiplier 범위가 있다", () => {
    const attackRules = Object.values(CONVERSION_RULES).filter(
      (r) => r.gameType === "attack",
    );
    for (const rule of attackRules) {
      expect(rule.multiplier).toBeDefined();
      expect(rule.multiplier?.min).toBeGreaterThan(0);
    }
  });

  it("heal 타입 규칙에는 healAmount 범위가 있다", () => {
    const healRules = Object.values(CONVERSION_RULES).filter(
      (r) => r.gameType === "heal",
    );
    for (const rule of healRules) {
      expect(rule.healAmount).toBeDefined();
      expect(rule.healAmount?.min).toBeGreaterThan(0);
    }
  });

  it("buff/debuff 타입 규칙에는 value와 duration 범위가 있다", () => {
    const buffDebuffRules = Object.values(CONVERSION_RULES).filter(
      (r) => r.gameType === "buff" || r.gameType === "debuff",
    );
    for (const rule of buffDebuffRules) {
      expect(rule.value).toBeDefined();
      expect(rule.duration).toBeDefined();
      expect(rule.value?.min).toBeGreaterThan(0);
      expect(rule.duration?.min).toBeGreaterThan(0);
    }
  });
});

describe("getOwHeroMetaByHeroId", () => {
  it("존재하는 heroId로 메타를 찾는다", () => {
    const meta = getOwHeroMetaByHeroId("dva");
    expect(meta).toBeDefined();
    expect(meta?.name).toBe("D.Va");
  });

  it("존재하지 않는 heroId는 undefined를 반환한다", () => {
    expect(getOwHeroMetaByHeroId("nonexistent")).toBeUndefined();
  });
});
