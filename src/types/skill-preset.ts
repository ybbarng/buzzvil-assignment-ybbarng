import type { Skill } from "@/types/skill";

/** 프리셋 스킬 항목 — isDefault 필드를 제외한 Skill */
export type SkillPresetEntry = Omit<Skill, "isDefault">;

/** 영웅별 스킬 프리셋 */
export interface HeroSkillPreset {
  /** HERO_PRESETS의 id와 매칭 */
  heroId: string;
  /** 3~5개 스킬 옵션 */
  skills: SkillPresetEntry[];
}
