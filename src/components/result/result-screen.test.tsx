/** ResultScreen: 결과 화면 렌더링 및 상호작용 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";
import { resetStores } from "@/test/helpers";
import type { BattleOutcome } from "@/types/game";
import { ResultScreen } from "./result-screen";

function setupResult(outcome: BattleOutcome, totalTurns: number) {
  useGameStore.setState({ phase: "result", outcome, totalTurns });
  useBattleStore.setState({
    player: {
      name: "영웅",
      baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
      currentHp: outcome === "lose" ? 0 : 42,
      currentMp: 10,
      skills: [],
      isDefending: false,
      buffs: [],
    },
    enemy: {
      name: "적",
      baseStats: { hp: 80, mp: 40, atk: 15, def: 8, spd: 10 },
      currentHp: outcome === "win" ? 0 : 30,
      currentMp: 5,
      skills: [],
      isDefending: false,
      buffs: [],
    },
    events: [],
  });
}

describe("ResultScreen", () => {
  afterEach(() => {
    resetStores();
  });

  it("승리 시 result-title에 '승리!'를 표시한다", () => {
    setupResult("win", 8);
    render(<ResultScreen />);
    expect(screen.getByTestId("result-title")).toHaveTextContent("승리!");
  });

  it("패배 시 result-title에 '패배'를 표시한다", () => {
    setupResult("lose", 12);
    render(<ResultScreen />);
    expect(screen.getByTestId("result-title")).toHaveTextContent("패배");
  });

  it("무승부 시 result-title에 '무승부'를 표시한다", () => {
    setupResult("draw", 20);
    render(<ResultScreen />);
    expect(screen.getByTestId("result-title")).toHaveTextContent("무승부");
  });

  it("result-turns에 총 턴 수를 표시한다", () => {
    setupResult("win", 15);
    render(<ResultScreen />);
    expect(screen.getByTestId("result-turns")).toHaveTextContent(
      "15턴 만에 전투 종료",
    );
  });

  it("restart-button을 렌더링한다", () => {
    setupResult("win", 5);
    render(<ResultScreen />);
    expect(screen.getByTestId("restart-button")).toBeInTheDocument();
  });

  it("restart-button 클릭 시 세팅 화면으로 돌아간다", async () => {
    setupResult("win", 5);
    render(<ResultScreen />);
    await userEvent.click(screen.getByTestId("restart-button"));
    expect(useGameStore.getState().phase).toBe("setting");
  });

  it("전투 데이터가 있으면 전투 분석 버튼을 표시한다", () => {
    setupResult("win", 10);
    render(<ResultScreen />);
    expect(screen.getByText("전투 분석")).toBeInTheDocument();
  });

  it("리플레이가 있으면 다시보기 버튼을 표시한다", () => {
    setupResult("win", 10);
    useReplayStore.setState({
      replays: [
        {
          version: 1,
          id: "test-id",
          timestamp: Date.now(),
          playerName: "영웅",
          enemyName: "적",
          difficulty: "normal",
          outcome: "win",
          totalTurns: 10,
          events: [],
        },
      ],
    });
    render(<ResultScreen />);
    expect(screen.getByText("다시보기")).toBeInTheDocument();
  });
});
