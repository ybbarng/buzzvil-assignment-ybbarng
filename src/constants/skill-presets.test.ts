import { describe, expect, it } from "vitest";
import { HERO_PRESETS } from "@/constants/presets";
import {
  getSkillPresetByHeroId,
  presetEntryToSkill,
  SKILL_PRESETS,
} from "@/constants/skill-presets";
import { SKILL_CONSTRAINTS } from "@/schemas/skill.schema";
import type { SkillPresetEntry } from "@/types/skill-preset";

// ow-skill-meta.test.ts가 메타데이터 원본(OW_HERO_META)과 생성 함수를 검증한다면,
// 이 파일은 최종 산출물(SKILL_PRESETS)의 공개 API를 검증한다.
// 일부 검증이 겹치지만, 생성 로직 변경 시 독립적으로 회귀를 감지하기 위해 유지한다.
describe("SKILL_PRESETS", () => {
  it("모든 HERO_PRESETS에 대응하는 스킬 프리셋이 존재한다", () => {
    const presetHeroIds = new Set(SKILL_PRESETS.map((p) => p.heroId));
    for (const hero of HERO_PRESETS) {
      expect(presetHeroIds.has(hero.id)).toBe(true);
    }
  });

  it("각 프리셋은 정확히 4개의 스킬을 가진다", () => {
    for (const preset of SKILL_PRESETS) {
      expect(preset.skills.length).toBe(4);
    }
  });

  it("스킬 이름은 1~8자이다", () => {
    for (const preset of SKILL_PRESETS) {
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

  it("mpCost는 제약 범위 내이다", () => {
    for (const preset of SKILL_PRESETS) {
      for (const skill of preset.skills) {
        expect(skill.mpCost).toBeGreaterThanOrEqual(
          SKILL_CONSTRAINTS.mpCost.min,
        );
        expect(skill.mpCost).toBeLessThanOrEqual(SKILL_CONSTRAINTS.mpCost.max);
      }
    }
  });

  it("attack 스킬의 multiplier는 제약 범위 내이다", () => {
    for (const preset of SKILL_PRESETS) {
      for (const skill of preset.skills) {
        if (skill.type === "attack") {
          expect(skill.multiplier).toBeGreaterThanOrEqual(
            SKILL_CONSTRAINTS.multiplier.min,
          );
          expect(skill.multiplier).toBeLessThanOrEqual(
            SKILL_CONSTRAINTS.multiplier.max,
          );
        }
      }
    }
  });

  it("heal 스킬의 healAmount는 제약 범위 내이다", () => {
    for (const preset of SKILL_PRESETS) {
      for (const skill of preset.skills) {
        if (skill.type === "heal") {
          expect(skill.healAmount).toBeGreaterThanOrEqual(
            SKILL_CONSTRAINTS.healAmount.min,
          );
          expect(skill.healAmount).toBeLessThanOrEqual(
            SKILL_CONSTRAINTS.healAmount.max,
          );
        }
      }
    }
  });

  it("buff/debuff 스킬의 value와 duration은 제약 범위 내이다", () => {
    for (const preset of SKILL_PRESETS) {
      for (const skill of preset.skills) {
        if (skill.type === "buff" || skill.type === "debuff") {
          expect(skill.value).toBeGreaterThanOrEqual(
            SKILL_CONSTRAINTS.value.min,
          );
          expect(skill.value).toBeLessThanOrEqual(SKILL_CONSTRAINTS.value.max);
          expect(skill.duration).toBeGreaterThanOrEqual(
            SKILL_CONSTRAINTS.duration.min,
          );
          expect(skill.duration).toBeLessThanOrEqual(
            SKILL_CONSTRAINTS.duration.max,
          );
        }
      }
    }
  });

  it("같은 프리셋 내에 중복 스킬 이름이 없다", () => {
    for (const preset of SKILL_PRESETS) {
      const names = preset.skills.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

describe("getSkillPresetByHeroId", () => {
  it("존재하는 heroId로 프리셋을 찾는다", () => {
    const preset = getSkillPresetByHeroId("dva");
    expect(preset).toBeDefined();
    expect(preset?.heroId).toBe("dva");
  });

  it("존재하지 않는 heroId는 undefined를 반환한다", () => {
    expect(getSkillPresetByHeroId("nonexistent")).toBeUndefined();
  });
});

describe("presetEntryToSkill", () => {
  it("isDefault: false가 추가된 Skill을 반환한다", () => {
    const entry: SkillPresetEntry = {
      name: "테스트",
      type: "attack",
      multiplier: 1.5,
      mpCost: 10,
    };
    const skill = presetEntryToSkill(entry);
    expect(skill.isDefault).toBe(false);
    expect(skill.name).toBe("테스트");
    expect(skill.type).toBe("attack");
  });
});
