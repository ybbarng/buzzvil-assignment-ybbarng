import { generateAllSkillPresets } from "@/constants/ow-skill-meta";
import type { Skill } from "@/types/skill";
import type { HeroSkillPreset, SkillPresetEntry } from "@/types/skill-preset";

/**
 * 오버워치 영웅별 스킬 프리셋 데이터.
 * OW_HERO_META의 메타데이터 + gameValues에서 자동 생성.
 * 스킬 이름은 SKILL_NAME_MAP에 의해 8자 이하로 축약.
 * 변환 원칙은 docs/skill-conversion-guide.md 참조.
 */
export const SKILL_PRESETS: HeroSkillPreset[] = generateAllSkillPresets();

/** heroId로 스킬 프리셋을 찾는다 */
export function getSkillPresetByHeroId(
  heroId: string,
): HeroSkillPreset | undefined {
  return SKILL_PRESETS.find((preset) => preset.heroId === heroId);
}

/** SkillPresetEntry를 Skill로 변환한다 (isDefault: false 추가) */
export function presetEntryToSkill(entry: SkillPresetEntry): Skill {
  const isDefault = false;
  if (entry.type === "attack") return { ...entry, isDefault };
  if (entry.type === "defend") return { ...entry, isDefault };
  if (entry.type === "heal") return { ...entry, isDefault };
  if (entry.type === "buff") return { ...entry, isDefault };
  if (entry.type === "debuff") return { ...entry, isDefault };
  const _exhaustive: never = entry;
  return _exhaustive;
}
