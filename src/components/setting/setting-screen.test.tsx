import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";

function resetStores() {
  useGameStore.getState().restart();
  useSettingStore.getState().reset();
  useBattleStore.getState().reset();
}

function setStatValue(testId: string, value: number) {
  fireEvent.change(screen.getByTestId(testId), {
    target: { value: String(value) },
  });
}

function allocateStats() {
  setStatValue("stat-hp", 60);
  setStatValue("stat-mp", 50);
  setStatValue("stat-atk", 30);
  setStatValue("stat-def", 30);
  setStatValue("stat-spd", 30);
}

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
