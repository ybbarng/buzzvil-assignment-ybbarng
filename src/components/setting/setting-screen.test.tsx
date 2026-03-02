import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import {
  INTRO_FADE_IN_WAIT_MS,
  INTRO_SETTLE_FALLBACK_MS,
} from "@/components/setting/setting-screen";
import { allocateStats, resetStores } from "@/test/helpers";

/** matchMedia를 모션 비활성화 상태로 override */
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

/** matchMedia를 모션 감소 활성화 상태로 override */
function mockMatchMediaReduce() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
}

describe("SettingScreen", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    resetStores();
    vi.restoreAllMocks();
  });

  it("prefers-reduced-motion이 활성화되어도 스텝 전환이 정상 동작한다", async () => {
    mockMatchMediaReduce();

    render(<App />);
    await userEvent.type(screen.getByTestId("name-input"), "테스터");
    allocateStats();
    await userEvent.click(screen.getByTestId("next-button"));

    expect(screen.getByTestId("add-skill-button")).toBeInTheDocument();
  });

  describe("인트로 애니메이션", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      mockMatchMediaNoReduce();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("인트로 중에는 폼이 렌더링되지 않고 헤더에 fade-in 애니메이션이 적용된다", () => {
      render(<App />);

      expect(screen.queryByTestId("name-input")).not.toBeInTheDocument();
      const heading = screen.getByText("BUZZ ARENA");
      expect(heading).toBeInTheDocument();
      // 헤더의 부모 컨테이너에 인트로 fade-in 클래스가 적용되어야 한다
      expect(heading.closest("[data-header]")).toHaveClass(
        "animate-intro-fade-in",
      );
    });

    it("인트로 완료 후 폼이 렌더링되고 헤더 애니메이션 클래스가 제거된다", () => {
      render(<App />);

      act(() => vi.advanceTimersByTime(INTRO_FADE_IN_WAIT_MS));
      act(() => vi.advanceTimersByTime(INTRO_SETTLE_FALLBACK_MS));

      expect(screen.getByTestId("name-input")).toBeInTheDocument();
      const heading = screen.getByText("BUZZ ARENA");
      expect(heading.closest("[data-header]")).not.toHaveClass(
        "animate-intro-fade-in",
      );
      expect(heading.closest("[data-header]")).not.toHaveClass(
        "animate-intro-settle",
      );
    });

    it("fade-in 대기 시간이 지나기 전에는 폼이 보이지 않는다", () => {
      render(<App />);

      act(() => vi.advanceTimersByTime(INTRO_FADE_IN_WAIT_MS - 1));

      expect(screen.queryByTestId("name-input")).not.toBeInTheDocument();
    });

    it("moving 상태에서 fallback 완료 전에는 폼이 보이지 않는다", () => {
      render(<App />);

      act(() => vi.advanceTimersByTime(INTRO_FADE_IN_WAIT_MS));
      act(() => vi.advanceTimersByTime(INTRO_SETTLE_FALLBACK_MS - 1));

      expect(screen.queryByTestId("name-input")).not.toBeInTheDocument();
    });

    it("prefers-reduced-motion이 활성화되면 인트로 없이 즉시 폼이 렌더링된다", () => {
      mockMatchMediaReduce();

      render(<App />);

      expect(screen.getByTestId("name-input")).toBeInTheDocument();
      expect(screen.getByText("BUZZ ARENA")).toBeInTheDocument();
    });
  });
});
