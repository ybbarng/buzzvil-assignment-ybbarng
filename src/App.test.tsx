import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { useGameStore } from "./stores/game-store";

describe("App", () => {
  afterEach(() => {
    useGameStore.getState().restart();
  });

  it("초기 상태에서 세팅 화면을 렌더링한다", () => {
    render(<App />);
    expect(screen.getByText("세팅")).toBeInTheDocument();
  });

  it("전투 시작 시 전투 화면으로 전환된다", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("전투 시작"));
    expect(screen.getByText("전투")).toBeInTheDocument();
  });

  it("전투 종료 시 결과 화면으로 전환된다", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("전투 시작"));
    await user.click(screen.getByText("승리"));
    expect(screen.getByTestId("result-title")).toHaveTextContent("승리");
    expect(screen.getByTestId("result-turns")).toHaveTextContent("5턴");
  });

  it("다시 시작 시 세팅 화면으로 돌아간다", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("전투 시작"));
    await user.click(screen.getByText("승리"));
    await user.click(screen.getByTestId("restart-button"));
    expect(screen.getByText("세팅")).toBeInTheDocument();
  });
});
