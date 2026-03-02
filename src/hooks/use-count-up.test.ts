/** useCountUpProgress: 카운트업 애니메이션 진행률 훅 */
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCountUpProgress } from "./use-count-up";

/** matchMedia를 모션 비활성화 상태로 override (애니메이션 활성) */
function mockMatchMediaNoReduce() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
}

describe("useCountUpProgress", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  describe("prefers-reduced-motion 활성 시", () => {
    it("즉시 progress 1을 반환한다", () => {
      const { result } = renderHook(() => useCountUpProgress());
      expect(result.current).toBe(1);
    });

    it("delay가 있어도 즉시 1을 반환한다", () => {
      const { result } = renderHook(() => useCountUpProgress(500));
      expect(result.current).toBe(1);
    });
  });

  describe("애니메이션 경로", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      mockMatchMediaNoReduce();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("초기 progress는 0이다", () => {
      const { result } = renderHook(() => useCountUpProgress(0));
      expect(result.current).toBe(0);
    });

    it("DURATION_MS 이상 경과 시 progress가 1에 도달한다", () => {
      const { result } = renderHook(() => useCountUpProgress(0));

      act(() => {
        vi.advanceTimersByTime(1300);
      });

      expect(result.current).toBe(1);
    });

    it("delay 동안에는 progress가 0을 유지한다", () => {
      const { result } = renderHook(() => useCountUpProgress(500));

      act(() => {
        vi.advanceTimersByTime(499);
      });

      expect(result.current).toBe(0);
    });

    it("delay 후 DURATION_MS 경과 시 progress가 1에 도달한다", () => {
      const { result } = renderHook(() => useCountUpProgress(500));

      act(() => {
        vi.advanceTimersByTime(500 + 1300);
      });

      expect(result.current).toBe(1);
    });

    it("언마운트 시 타이머가 정리되어 에러가 발생하지 않는다", () => {
      const { unmount } = renderHook(() => useCountUpProgress(100));
      unmount();

      act(() => {
        vi.advanceTimersByTime(2000);
      });
    });
  });
});
