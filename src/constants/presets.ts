import { generateAllHeroPresets } from "@/constants/ow-hero-meta";
import type { HeroPreset, HeroRole, HeroSubRole } from "@/types/preset";

export const ROLE_LABELS: Record<HeroRole, string> = {
  tank: "돌격",
  damage: "공격",
  support: "지원",
};

export const SUB_ROLE_LABELS: Record<HeroSubRole, string> = {
  initiator: "개시자",
  brawler: "투사",
  anchor: "강건한 자",
  specialist: "전문가",
  scout: "수색가",
  flanker: "측면 공격가",
  marksman: "명사수",
  tactician: "전술가",
  medic: "의무관",
  survivor: "생존왕",
};

/** 각 역할군의 서브역할군 순서 */
export const ROLE_SUB_ROLES: Record<HeroRole, HeroSubRole[]> = {
  tank: ["initiator", "brawler", "anchor"],
  damage: ["specialist", "scout", "flanker", "marksman"],
  support: ["tactician", "medic", "survivor"],
};

/**
 * 메타데이터 + 서브역할군 기본 스탯(변환 규칙)으로 자동 생성된 영웅 프리셋.
 *
 * 원본 데이터: src/constants/ow-hero-meta.ts
 * 설계 문서: docs/preset-design.md
 */
export const HERO_PRESETS: HeroPreset[] = generateAllHeroPresets();

export function getPresetsByRole(role: HeroRole): HeroPreset[] {
  return HERO_PRESETS.filter((preset) => preset.role === role);
}

export function getPresetsBySubRole(subRole: HeroSubRole): HeroPreset[] {
  return HERO_PRESETS.filter((preset) => preset.subRole === subRole);
}
