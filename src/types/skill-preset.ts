import type { Skill } from "@/types/skill";

/** union 타입에서 분산적으로 Omit을 적용 */
type DistributiveOmit<T, K extends keyof T> = T extends T ? Omit<T, K> : never;

/** 프리셋 스킬 항목 — isDefault 필드를 제외한 Skill (discriminated union 보존) */
export type SkillPresetEntry = DistributiveOmit<Skill, "isDefault">;

/** 영웅별 스킬 프리셋 */
export interface HeroSkillPreset {
  /** HERO_PRESETS의 id와 매칭 */
  heroId: string;
  /** 3~5개 스킬 옵션 */
  skills: SkillPresetEntry[];
}
