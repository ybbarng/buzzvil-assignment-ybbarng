import { afterEach, describe, expect, it } from "vitest";
import { useGameStore } from "./game-store";

describe("game-store", () => {
  afterEach(() => {
    useGameStore.getState().restart();
  });

  it("초기 phase는 setting이다", () => {
    expect(useGameStore.getState().phase).toBe("setting");
  });

  it("startBattle로 battle phase로 전환된다", () => {
    useGameStore.getState().startBattle();
    expect(useGameStore.getState().phase).toBe("battle");
  });

  it("showResult로 result phase로 전환되고 결과가 저장된다", () => {
    useGameStore.getState().startBattle();
    useGameStore.getState().showResult("win", 10);
    const state = useGameStore.getState();
    expect(state.phase).toBe("result");
    expect(state.outcome).toBe("win");
    expect(state.totalTurns).toBe(10);
  });

  it("restart로 초기 상태로 돌아간다", () => {
    useGameStore.getState().startBattle();
    useGameStore.getState().showResult("lose", 15);
    useGameStore.getState().restart();
    const state = useGameStore.getState();
    expect(state.phase).toBe("setting");
    expect(state.outcome).toBeNull();
    expect(state.totalTurns).toBe(0);
  });
});
