/**
 * 게임 UI 기울임(skew) 스타일 상수.
 *
 * Koverwatch 폰트의 이탤릭 특성에 맞춰 대각선 UI와 이탤릭 폰트를 사용하고 있으나,
 * SKEW_ENABLED를 false로 변경하면 기울임 없는 버전으로 전환할 수 있다.
 */
const SKEW_ENABLED = true;

/** 컨테이너에 적용하는 기울임 (평행사변형) */
export const SKEW = SKEW_ENABLED ? "-skew-x-12" : "";

/** 컨테이너 내부 텍스트 보정용 역기울임 */
export const SKEW_TEXT = SKEW_ENABLED ? "skew-x-12" : "";

/** 툴팁 등 작은 요소용 약한 기울임 */
export const SKEW_SUBTLE = SKEW_ENABLED ? "-skew-x-6" : "";

/** body에 적용할 폰트 이탤릭 여부 */
export const FONT_ITALIC = SKEW_ENABLED;

/** 스텝 전환 애니메이션의 요소 간 stagger 간격 (ms) */
export const STAGGER_MS = 400;

/** 주어진 인덱스에 해당하는 animationDelay 스타일 */
export function staggerDelay(index: number): { animationDelay: string } {
  return { animationDelay: `${index * STAGGER_MS}ms` };
}

/** 방향에 따른 슬라이드 입장 애니메이션 클래스 */
export function slideInClass(direction: "forward" | "backward"): string {
  return direction === "forward"
    ? "animate-slide-in-right"
    : "animate-slide-in-left";
}
