import type { Stats } from "@/types/character";
import type { HeroRole, HeroSubRole } from "@/types/preset";

/** 스탯 조정값 — 서브역할군 기본 스탯 대비 편차 (합계 0 유지) */
export type StatAdjustments = {
  [K in keyof Stats]: number;
};

/** OW 영웅 스탯 메타데이터 — 변환에 필요한 원본 정보 */
export interface OwHeroStatMeta {
  heroId: string;
  name: string;
  role: HeroRole;
  subRole: HeroSubRole;
  description: string;
  /** 서브역할군 기본 스탯 대비 조정값 (합계 0) */
  adjustments: StatAdjustments;
  /** 조정 근거 — OW에서의 캐릭터 특성 기반 */
  rationale: string;
}

/** 서브역할군별 기본 스탯 규칙 */
export type SubRoleBaseStats = Record<HeroSubRole, Stats>;
