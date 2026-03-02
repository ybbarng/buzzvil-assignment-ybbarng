import type { Skill } from "@/types/skill";
import type { DistributiveOmit } from "@/types/utils";

/** 프리셋 스킬 항목 — isDefault 필드를 제외한 Skill (discriminated union 보존) */
export type SkillPresetEntry = DistributiveOmit<Skill, "isDefault">;

/** 영웅별 스킬 프리셋 */
export interface HeroSkillPreset {
  /** HERO_PRESETS의 id와 매칭 */
  heroId: string;
  /** 영웅당 4개 스킬 */
  skills: SkillPresetEntry[];
}
