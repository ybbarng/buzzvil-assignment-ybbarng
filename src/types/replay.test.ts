import { describe, expect, it } from "vitest";
import { isValidReplay, REPLAY_VERSION } from "./replay";

describe("isValidReplay", () => {
  const validData = {
    version: REPLAY_VERSION,
    id: "test-id",
    timestamp: Date.now(),
    playerName: "플레이어",
    enemyName: "적",
    difficulty: "normal",
    outcome: "win",
    totalTurns: 5,
    events: [{ type: "round-start", round: 1 }],
  };

  it("유효한 데이터를 통과시킨다", () => {
    expect(isValidReplay(validData)).toBe(true);
  });

  it("null을 거부한다", () => {
    expect(isValidReplay(null)).toBe(false);
  });

  it("undefined를 거부한다", () => {
    expect(isValidReplay(undefined)).toBe(false);
  });

  it("문자열을 거부한다", () => {
    expect(isValidReplay("not an object")).toBe(false);
  });

  it("버전이 다른 데이터를 거부한다", () => {
    expect(isValidReplay({ ...validData, version: 999 })).toBe(false);
  });

  it("버전이 없는 데이터를 거부한다", () => {
    const { version: _, ...noVersion } = validData;
    expect(isValidReplay(noVersion)).toBe(false);
  });

  it("id가 없는 데이터를 거부한다", () => {
    const { id: _, ...noId } = validData;
    expect(isValidReplay(noId)).toBe(false);
  });

  it("timestamp가 없는 데이터를 거부한다", () => {
    const { timestamp: _, ...noTimestamp } = validData;
    expect(isValidReplay(noTimestamp)).toBe(false);
  });

  it("playerName이 없는 데이터를 거부한다", () => {
    const { playerName: _, ...noPlayerName } = validData;
    expect(isValidReplay(noPlayerName)).toBe(false);
  });

  it("enemyName이 없는 데이터를 거부한다", () => {
    const { enemyName: _, ...noEnemyName } = validData;
    expect(isValidReplay(noEnemyName)).toBe(false);
  });

  it("events가 빈 배열이면 거부한다", () => {
    expect(isValidReplay({ ...validData, events: [] })).toBe(false);
  });

  it("events가 배열이 아니면 거부한다", () => {
    expect(isValidReplay({ ...validData, events: "not-array" })).toBe(false);
  });

  it("difficulty가 없는 데이터를 거부한다", () => {
    const { difficulty: _, ...noDifficulty } = validData;
    expect(isValidReplay(noDifficulty)).toBe(false);
  });

  it("difficulty가 유효하지 않은 값이면 거부한다", () => {
    expect(isValidReplay({ ...validData, difficulty: "impossible" })).toBe(
      false,
    );
  });

  it("outcome이 없는 데이터를 거부한다", () => {
    const { outcome: _, ...noOutcome } = validData;
    expect(isValidReplay(noOutcome)).toBe(false);
  });

  it("outcome이 유효하지 않은 값이면 거부한다", () => {
    expect(isValidReplay({ ...validData, outcome: "surrender" })).toBe(false);
  });

  it("totalTurns가 없는 데이터를 거부한다", () => {
    const { totalTurns: _, ...noTotalTurns } = validData;
    expect(isValidReplay(noTotalTurns)).toBe(false);
  });
});
