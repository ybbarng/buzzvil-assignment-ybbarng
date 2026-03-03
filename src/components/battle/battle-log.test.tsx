/** BattleLog: 이벤트 유형별 렌더링, 접근성 속성 검증 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CharacterSnapshot } from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import { BattleLog } from "./battle-log";

const SNAP: CharacterSnapshot = {
  name: "용사",
  baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
  currentHp: 100,
  currentMp: 50,
  isDefending: false,
  buffs: [],
};

const ENEMY_SNAP: CharacterSnapshot = { ...SNAP, name: "적" };

describe("BattleLog", () => {
  it("role=log과 aria-live=polite 속성을 갖는다", () => {
    render(<BattleLog events={[]} playerName="용사" enemyName="적" />);
    const log = screen.getByTestId("battle-log");
    expect(log).toHaveAttribute("role", "log");
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveAttribute("aria-label", "전투 로그");
  });

  it("이벤트가 없으면 '전투가 시작되었습니다'를 표시한다", () => {
    render(<BattleLog events={[]} playerName="용사" enemyName="적" />);
    expect(screen.getByText("전투가 시작되었습니다")).toBeInTheDocument();
  });

  it("round-start 이벤트를 렌더링한다", () => {
    const events: RoundEvent[] = [
      {
        type: "round-start",
        round: 1,
        playerSnapshot: SNAP,
        enemySnapshot: ENEMY_SNAP,
      },
    ];
    render(<BattleLog events={events} playerName="용사" enemyName="적" />);
    expect(screen.getByText(/1 라운드/)).toBeInTheDocument();
  });

  it("skill-effect 이벤트를 렌더링한다", () => {
    const events: RoundEvent[] = [
      {
        type: "skill-effect",
        round: 1,
        actor: "player",
        actorName: "용사",
        targetName: "적",
        skillName: "강타",
        skillType: "attack",
        value: 25,
        playerSnapshot: SNAP,
        enemySnapshot: ENEMY_SNAP,
      },
    ];
    render(<BattleLog events={events} playerName="용사" enemyName="적" />);
    const log = screen.getByTestId("battle-log");
    expect(log.textContent).toContain("용사");
    expect(log.textContent).toContain("25");
  });

  it("defend 이벤트를 렌더링한다", () => {
    const events: RoundEvent[] = [
      {
        type: "defend",
        round: 1,
        actor: "player",
        actorName: "용사",
        playerSnapshot: SNAP,
        enemySnapshot: ENEMY_SNAP,
      },
    ];
    render(<BattleLog events={events} playerName="용사" enemyName="적" />);
    const log = screen.getByTestId("battle-log");
    expect(log.textContent).toContain("용사");
    expect(log.textContent).toContain("방어");
  });

  it("battle-end 이벤트를 렌더링한다", () => {
    const events: RoundEvent[] = [
      {
        type: "battle-end",
        round: 5,
        outcome: "win",
        playerSnapshot: SNAP,
        enemySnapshot: ENEMY_SNAP,
      },
    ];
    render(<BattleLog events={events} playerName="용사" enemyName="적" />);
    const log = screen.getByTestId("battle-log");
    expect(log.textContent).toContain("승리");
  });

  it("여러 이벤트를 순서대로 렌더링한다", () => {
    const events: RoundEvent[] = [
      {
        type: "round-start",
        round: 1,
        playerSnapshot: SNAP,
        enemySnapshot: ENEMY_SNAP,
      },
      {
        type: "skill-effect",
        round: 1,
        actor: "player",
        actorName: "용사",
        targetName: "적",
        skillName: "공격",
        skillType: "attack",
        value: 15,
        playerSnapshot: SNAP,
        enemySnapshot: ENEMY_SNAP,
      },
      {
        type: "skill-effect",
        round: 1,
        actor: "enemy",
        actorName: "적",
        targetName: "용사",
        skillName: "공격",
        skillType: "attack",
        value: 10,
        playerSnapshot: SNAP,
        enemySnapshot: ENEMY_SNAP,
      },
    ];
    render(<BattleLog events={events} playerName="용사" enemyName="적" />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });
});
