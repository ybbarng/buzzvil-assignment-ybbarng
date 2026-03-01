import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { allocateStats, resetStores } from "@/test/helpers";

describe("SettingScreen", () => {
  afterEach(() => {
    resetStores();
    vi.restoreAllMocks();
  });

  it("prefers-reduced-motion이 활성화되어도 스텝 전환이 정상 동작한다", async () => {
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

    render(<App />);
    await userEvent.type(screen.getByTestId("name-input"), "테스터");
    allocateStats();
    await userEvent.click(screen.getByTestId("next-button"));

    expect(screen.getByTestId("add-skill-button")).toBeInTheDocument();
  });
});
