import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { useGameStore } from "./stores/game-store";
import { useSettingStore } from "./stores/setting-store";

describe("App", () => {
  afterEach(() => {
    useGameStore.getState().restart();
    useSettingStore.getState().reset();
  });

  it("초기 상태에서 세팅 화면을 렌더링한다", () => {
    render(<App />);
    expect(screen.getByText("캐릭터 세팅")).toBeInTheDocument();
  });

  it("battle phase에서 전투 화면을 렌더링한다", () => {
    useGameStore.setState({ phase: "battle" });
    render(<App />);
    expect(screen.getByText("전투")).toBeInTheDocument();
  });

  it("result phase에서 결과 화면을 렌더링한다", () => {
    useGameStore.setState({ phase: "result", outcome: "win", totalTurns: 5 });
    render(<App />);
    expect(screen.getByTestId("result-title")).toHaveTextContent("승리");
    expect(screen.getByTestId("result-turns")).toHaveTextContent("5턴");
  });
});
