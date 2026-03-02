import "@testing-library/jest-dom/vitest";

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom에 matchMedia가 없으므로 mock 제공.
// prefers-reduced-motion을 기본 활성화하여 인트로 애니메이션 등
// 타이머 기반 시퀀스를 건너뛰고, 개별 테스트에서 필요 시 override.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
