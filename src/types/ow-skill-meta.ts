/**
 * 오버워치 스킬의 원본 분류.
 * docs/skill-conversion-guide.md의 변환표 행과 대응하며,
 * 자가 치유(self_heal)를 별도 분류로 추가.
 */
export type OwSkillCategory =
  | "ultimate_damage" // 궁극기 - 고데미지
  | "ultimate_cc" // 궁극기 - CC/범위 제어
  | "ultimate_heal" // 궁극기 - 힐/부활
  | "ultimate_buff" // 궁극기 - 강화/변신
  | "attack" // 일반 공격 능력
  | "movement" // 이동기/회피기
  | "barrier" // 방벽/보호막
  | "healing" // 아군 힐링
  | "self_heal" // 자가 치유/무적
  | "attack_buff" // 공격 강화
  | "cc"; // CC (스턴/둔화/해킹 등)

/** 오버워치 스킬 메타데이터 */
export interface OwSkillMeta {
  /** 오버워치 공식 한국어 이름 (축약 전 원본) */
  name: string;
  /** 오버워치 스킬 분류 */
  category: OwSkillCategory;
  /** 오버워치에서의 동작 요약 */
  description: string;
}

/** 오버워치 영웅 메타데이터 */
export interface OwHeroMeta {
  /** HERO_PRESETS의 id와 매칭 */
  heroId: string;
  /** 영웅 한국어 이름 */
  name: string;
  /** 역할군 */
  role: "tank" | "damage" | "support";
  /** 스킬 메타데이터 (skill-presets.ts와 같은 순서) */
  skills: OwSkillMeta[];
}

/** 카테고리별 게임 스킬 변환 규칙 */
export interface ConversionRule {
  /** 변환 대상 게임 스킬 타입 */
  gameType: "attack" | "defend" | "heal" | "buff" | "debuff";
  /** buff/debuff 대상 (atk/def) */
  target?: "atk" | "def";
  /** MP 비용 범위 */
  mpCost: { min: number; max: number };
  /** attack 배율 범위 */
  multiplier?: { min: number; max: number };
  /** heal 회복량 범위 */
  healAmount?: { min: number; max: number };
  /** buff/debuff 수치 범위 */
  value?: { min: number; max: number };
  /** buff/debuff 지속 턴 범위 */
  duration?: { min: number; max: number };
}
