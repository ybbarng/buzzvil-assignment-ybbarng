import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { useBattleStore } from "./stores/battle-store";
import { useGameStore } from "./stores/game-store";
import { useSettingStore } from "./stores/setting-store";

describe("App", () => {
  afterEach(() => {
    useGameStore.getState().restart();
    useSettingStore.getState().reset();
    useBattleStore.getState().reset();
  });

  it("초기 상태에서 세팅 화면을 렌더링한다", () => {
    render(<App />);
    expect(screen.getByText("캐릭터 세팅")).toBeInTheDocument();
  });

  it("battle phase에서 전투 화면을 렌더링한다", () => {
    useSettingStore.setState({ name: "테스터" });
    useGameStore.setState({ phase: "battle" });
    render(<App />);
    expect(screen.getByTestId("round-display")).toBeInTheDocument();
    expect(screen.getByTestId("player-panel")).toBeInTheDocument();
    expect(screen.getByTestId("enemy-panel")).toBeInTheDocument();
  });

  it("result phase에서 결과 화면을 렌더링한다", () => {
    useGameStore.setState({ phase: "result", outcome: "win", totalTurns: 5 });
    render(<App />);
    expect(screen.getByTestId("result-title")).toHaveTextContent("승리");
    expect(screen.getByTestId("result-turns")).toHaveTextContent("5턴");
  });

  it("다시 시작 버튼을 누르면 세팅 화면으로 돌아간다", async () => {
    useGameStore.setState({ phase: "result", outcome: "win", totalTurns: 5 });
    render(<App />);

    await userEvent.click(screen.getByTestId("restart-button"));

    expect(useGameStore.getState().phase).toBe("setting");
    expect(screen.getByText("캐릭터 세팅")).toBeInTheDocument();
  });
});
