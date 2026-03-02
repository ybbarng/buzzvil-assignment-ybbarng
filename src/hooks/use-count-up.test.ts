/** useCountUpProgress: 카운트업 애니메이션 진행률 훅 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCountUpProgress } from "./use-count-up";

describe("useCountUpProgress", () => {
  // vitest setup에서 prefers-reduced-motion: reduce가 설정되어 있으므로
  // 애니메이션을 건너뛰고 즉시 1을 반환해야 한다.
  it("prefers-reduced-motion일 때 즉시 progress 1을 반환한다", () => {
    const { result } = renderHook(() => useCountUpProgress());
    expect(result.current).toBe(1);
  });

  it("delay 파라미터를 받을 수 있다", () => {
    const { result } = renderHook(() => useCountUpProgress(100));
    // reduced-motion이므로 delay 무관하게 즉시 1
    expect(result.current).toBe(1);
  });
});
