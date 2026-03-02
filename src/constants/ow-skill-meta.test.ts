import { describe, expect, it } from "vitest";
import {
  CONVERSION_RULES,
  generateAllSkillPresets,
  generateSkillPreset,
  getOwHeroMetaByHeroId,
  OW_HERO_META,
  SKILL_NAME_MAP,
} from "@/constants/ow-skill-meta";
import { HERO_PRESETS } from "@/constants/presets";
import { SKILL_CONSTRAINTS } from "@/schemas/skill.schema";

// 메타데이터 원본(OW_HERO_META)과 생성 함수를 검증한다.
// 최종 산출물(SKILL_PRESETS)의 공개 API 검증은 skill-presets.test.ts에서 수행.
describe("OW_HERO_META", () => {
  // OW2 2026년 기준 50명. 영웅 추가/제거 시 이 값도 함께 업데이트할 것.
  it("50명 영웅이 모두 포함되어 있다", () => {
    expect(OW_HERO_META.length).toBe(50);
  });

  it("모든 HERO_PRESETS에 대응하는 메타데이터가 존재한다", () => {
    const metaHeroIds = new Set(OW_HERO_META.map((h) => h.heroId));
    for (const hero of HERO_PRESETS) {
      expect(metaHeroIds.has(hero.id)).toBe(true);
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

  it("모든 스킬에 name, category, description, gameValues가 있다", () => {
    for (const hero of OW_HERO_META) {
      for (const skill of hero.skills) {
        expect(skill.name.length).toBeGreaterThan(0);
        expect(skill.category.length).toBeGreaterThan(0);
        expect(skill.description.length).toBeGreaterThan(0);
        expect(skill.gameValues).toBeDefined();
        expect(skill.gameValues.mpCost).toBeGreaterThan(0);
      }
    }
  });

  it("같은 영웅 내에 중복 스킬 이름이 없다", () => {
    for (const hero of OW_HERO_META) {
      const names = hero.skills.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });

  // generateSkillPreset()이 gameValues를 그대로 전달하므로,
  // 이 검증이 프리셋 수치의 범위 보장에도 역할한다 (defense-in-depth).
  it("gameValues의 수치가 게임 제약 범위 내이다", () => {
    for (const hero of OW_HERO_META) {
      for (const skill of hero.skills) {
        const gv = skill.gameValues;
        expect(gv.mpCost).toBeGreaterThanOrEqual(SKILL_CONSTRAINTS.mpCost.min);
        expect(gv.mpCost).toBeLessThanOrEqual(SKILL_CONSTRAINTS.mpCost.max);

        if (gv.type === "attack") {
          expect(gv.multiplier).toBeGreaterThanOrEqual(
            SKILL_CONSTRAINTS.multiplier.min,
          );
          expect(gv.multiplier).toBeLessThanOrEqual(
            SKILL_CONSTRAINTS.multiplier.max,
          );
        } else if (gv.type === "heal") {
          expect(gv.healAmount).toBeGreaterThanOrEqual(
            SKILL_CONSTRAINTS.healAmount.min,
          );
          expect(gv.healAmount).toBeLessThanOrEqual(
            SKILL_CONSTRAINTS.healAmount.max,
          );
        } else if (gv.type === "buff" || gv.type === "debuff") {
          expect(gv.value).toBeGreaterThanOrEqual(SKILL_CONSTRAINTS.value.min);
          expect(gv.value).toBeLessThanOrEqual(SKILL_CONSTRAINTS.value.max);
          expect(gv.duration).toBeGreaterThanOrEqual(
            SKILL_CONSTRAINTS.duration.min,
          );
          expect(gv.duration).toBeLessThanOrEqual(
            SKILL_CONSTRAINTS.duration.max,
          );
        }
      }
    }
  });

  it("gameValues가 해당 카테고리의 CONVERSION_RULES 범위에 부합한다", () => {
    for (const hero of OW_HERO_META) {
      for (const skill of hero.skills) {
        const rule = CONVERSION_RULES[skill.category];
        const gv = skill.gameValues;

        // 카테고리의 예상 gameType과 실제 gameValues type이 일치해야 한다
        expect(gv.type).toBe(rule.gameType);

        expect(gv.mpCost).toBeGreaterThanOrEqual(rule.mpCost.min);
        expect(gv.mpCost).toBeLessThanOrEqual(rule.mpCost.max);

        if (rule.multiplier && gv.type === "attack") {
          expect(gv.multiplier).toBeGreaterThanOrEqual(rule.multiplier.min);
          expect(gv.multiplier).toBeLessThanOrEqual(rule.multiplier.max);
        }
        if (rule.healAmount && gv.type === "heal") {
          expect(gv.healAmount).toBeGreaterThanOrEqual(rule.healAmount.min);
          expect(gv.healAmount).toBeLessThanOrEqual(rule.healAmount.max);
        }
        if (rule.value && (gv.type === "buff" || gv.type === "debuff")) {
          expect(gv.value).toBeGreaterThanOrEqual(rule.value.min);
          expect(gv.value).toBeLessThanOrEqual(rule.value.max);
        }
        if (rule.duration && (gv.type === "buff" || gv.type === "debuff")) {
          expect(gv.duration).toBeGreaterThanOrEqual(rule.duration.min);
          expect(gv.duration).toBeLessThanOrEqual(rule.duration.max);
        }
      }
    }
  });
});

describe("SKILL_NAME_MAP", () => {
  it("매핑된 이름은 8자 이하이다", () => {
    for (const [original, shortened] of Object.entries(SKILL_NAME_MAP)) {
      expect(original.length).toBeGreaterThan(8);
      expect(shortened.length).toBeLessThanOrEqual(8);
    }
  });

  it("OW_HERO_META에서 매핑 대상 스킬이 실제로 존재한다", () => {
    const allSkillNames = OW_HERO_META.flatMap((h) =>
      h.skills.map((s) => s.name),
    );
    for (const original of Object.keys(SKILL_NAME_MAP)) {
      expect(allSkillNames).toContain(original);
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

describe("generateSkillPreset", () => {
  it("단일 영웅의 스킬 프리셋을 올바르게 생성한다", () => {
    const dvaMeta = getOwHeroMetaByHeroId("dva");
    if (!dvaMeta) throw new Error("dva meta not found");
    const preset = generateSkillPreset(dvaMeta);

    expect(preset.heroId).toBe("dva");
    expect(preset.skills).toHaveLength(4);
    expect(preset.skills[0].name).toBe("부스터");
    expect(preset.skills[0].type).toBe("buff");
  });

  it("SKILL_NAME_MAP에 의해 긴 이름이 축약된다", () => {
    const bastionMeta = getOwHeroMetaByHeroId("bastion");
    if (!bastionMeta) throw new Error("bastion meta not found");
    const preset = generateSkillPreset(bastionMeta);

    const grenadeSkill = preset.skills.find((s) => s.name === "전술 수류탄");
    expect(grenadeSkill).toBeDefined();
  });

  it("대표 영웅의 스킬 변환이 정확하다", () => {
    const dvaMeta = getOwHeroMetaByHeroId("dva");
    if (!dvaMeta) throw new Error("dva meta not found");
    const dvaPreset = generateSkillPreset(dvaMeta);

    // movement(부스터) → buff DEF +4, 2턴, MP 7
    expect(dvaPreset.skills[0]).toEqual({
      name: "부스터",
      type: "buff",
      target: "def",
      mpCost: 7,
      value: 4,
      duration: 2,
    });
    // ultimate_damage(자폭) → attack ×2.8, MP 25
    expect(dvaPreset.skills[3]).toEqual({
      name: "자폭",
      type: "attack",
      mpCost: 25,
      multiplier: 2.8,
    });

    const genjiMeta = getOwHeroMetaByHeroId("genji");
    if (!genjiMeta) throw new Error("genji meta not found");
    const genjiPreset = generateSkillPreset(genjiMeta);

    // attack(수리검) → attack ×1.4, MP 8
    expect(genjiPreset.skills[0]).toEqual({
      name: "수리검",
      type: "attack",
      mpCost: 8,
      multiplier: 1.4,
    });
    // ultimate_damage(용검) → attack ×2.8, MP 25
    expect(genjiPreset.skills[3]).toEqual({
      name: "용검",
      type: "attack",
      mpCost: 25,
      multiplier: 2.8,
    });
  });
});

describe("generateAllSkillPresets", () => {
  const presets = generateAllSkillPresets();

  it("모든 HERO_PRESETS에 대응하는 프리셋이 생성된다", () => {
    const presetHeroIds = new Set(presets.map((p) => p.heroId));
    for (const hero of HERO_PRESETS) {
      expect(presetHeroIds.has(hero.id)).toBe(true);
    }
  });

  it("생성된 스킬 이름은 1~8자이다", () => {
    for (const preset of presets) {
      for (const skill of preset.skills) {
        expect(skill.name.length).toBeGreaterThanOrEqual(
          SKILL_CONSTRAINTS.name.min,
        );
        expect(skill.name.length).toBeLessThanOrEqual(
          SKILL_CONSTRAINTS.name.max,
        );
      }
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
