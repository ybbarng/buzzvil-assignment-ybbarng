/** CharacterPanel: 캐릭터 정보 표시, 스냅샷 반영, 버프/디버프 표시 검증 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BattleCharacter, CharacterSnapshot } from "@/types/battle";
import { CharacterPanel } from "./character-panel";

function makeCharacter(overrides?: Partial<BattleCharacter>): BattleCharacter {
  return {
    name: "용사",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
    currentHp: 80,
    currentMp: 30,
    skills: [
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
    ],
    isDefending: false,
    buffs: [],
    ...overrides,
  };
}

describe("CharacterPanel", () => {
  it("캐릭터 이름을 표시한다", () => {
    render(
      <CharacterPanel
        character={makeCharacter()}
        testId="player-panel"
        nameTestId="player-name"
        side="player"
      />,
    );
    expect(screen.getByTestId("player-name")).toHaveTextContent("용사");
  });

  it("HP와 MP progressbar를 표시한다", () => {
    render(
      <CharacterPanel
        character={makeCharacter()}
        testId="player-panel"
        nameTestId="player-name"
        side="player"
      />,
    );
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(2);
    // HP bar
    expect(bars[0]).toHaveAttribute("aria-label", "체력");
    expect(bars[0]).toHaveAttribute("aria-valuenow", "80");
    // MP bar
    expect(bars[1]).toHaveAttribute("aria-label", "마나");
    expect(bars[1]).toHaveAttribute("aria-valuenow", "30");
  });

  it("스냅샷이 있으면 스냅샷의 HP/MP를 표시한다", () => {
    const snapshot: CharacterSnapshot = {
      name: "용사",
      baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
      currentHp: 60,
      currentMp: 20,
      isDefending: false,
      buffs: [],
    };
    render(
      <CharacterPanel
        character={makeCharacter()}
        snapshot={snapshot}
        testId="player-panel"
        nameTestId="player-name"
        side="player"
      />,
    );
    const bars = screen.getAllByRole("progressbar");
    expect(bars[0]).toHaveAttribute("aria-valuenow", "60");
    expect(bars[1]).toHaveAttribute("aria-valuenow", "20");
  });

  it("ATK/DEF/SPD 스탯을 표시한다", () => {
    render(
      <CharacterPanel
        character={makeCharacter()}
        testId="player-panel"
        nameTestId="player-name"
        side="player"
      />,
    );
    expect(screen.getByText("20")).toBeInTheDocument(); // ATK
    expect(screen.getByText("10")).toBeInTheDocument(); // DEF
    expect(screen.getByText("15")).toBeInTheDocument(); // SPD
  });

  it("버프가 있으면 표시한다", () => {
    render(
      <CharacterPanel
        character={makeCharacter({
          buffs: [{ target: "atk", value: 5, remainingTurns: 2 }],
        })}
        testId="player-panel"
        nameTestId="player-name"
        side="player"
      />,
    );
    expect(screen.getByText(/ATK \+5/)).toBeInTheDocument();
    expect(screen.getByText(/2턴/)).toBeInTheDocument();
  });

  it("디버프가 있으면 표시한다", () => {
    render(
      <CharacterPanel
        character={makeCharacter({
          buffs: [{ target: "def", value: -3, remainingTurns: 1 }],
        })}
        testId="player-panel"
        nameTestId="player-name"
        side="player"
      />,
    );
    expect(screen.getByText(/DEF -3/)).toBeInTheDocument();
  });

  it("data-testid가 올바르게 적용된다", () => {
    render(
      <CharacterPanel
        character={makeCharacter()}
        testId="enemy-panel"
        nameTestId="enemy-name"
        side="enemy"
      />,
    );
    expect(screen.getByTestId("enemy-panel")).toBeInTheDocument();
    expect(screen.getByTestId("enemy-name")).toBeInTheDocument();
  });
});
