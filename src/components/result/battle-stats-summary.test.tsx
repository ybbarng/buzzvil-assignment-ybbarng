/** BattleStatsSummary: 전투 통계 비교 행 렌더링 검증 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BattleStats } from "@/logic/battle-stats";
import type { BattleCharacter } from "@/types/battle";
import { BattleStatsSummary } from "./battle-stats-summary";

function makeCharacter(overrides?: Partial<BattleCharacter>): BattleCharacter {
  return {
    name: "용사",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
    currentHp: 80,
    currentMp: 30,
    skills: [],
    isDefending: false,
    buffs: [],
    ...overrides,
  };
}

const ZERO_STATS: BattleStats = {
  damageDealt: 0,
  damageMitigated: 0,
  healingDone: 0,
  skillsUsed: 0,
};

describe("BattleStatsSummary", () => {
  it("플레이어와 적 이름을 표시한다", () => {
    render(
      <BattleStatsSummary
        player={makeCharacter({ name: "전사" })}
        enemy={makeCharacter({ name: "드래곤" })}
        playerStats={ZERO_STATS}
        enemyStats={ZERO_STATS}
        baseDelay={0}
      />,
    );
    expect(screen.getByText("전사")).toBeInTheDocument();
    expect(screen.getByText("드래곤")).toBeInTheDocument();
  });

  it("VS 라벨을 표시한다", () => {
    render(
      <BattleStatsSummary
        player={makeCharacter()}
        enemy={makeCharacter({ name: "적" })}
        playerStats={ZERO_STATS}
        enemyStats={ZERO_STATS}
        baseDelay={0}
      />,
    );
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("6개의 통계 라벨을 표시한다", () => {
    render(
      <BattleStatsSummary
        player={makeCharacter()}
        enemy={makeCharacter({ name: "적" })}
        playerStats={ZERO_STATS}
        enemyStats={ZERO_STATS}
        baseDelay={0}
      />,
    );
    const labels = [
      "남은 체력",
      "남은 마나",
      "가한 데미지",
      "방어 시 피해",
      "회복량",
      "스킬 사용",
    ];
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("통계 값을 숫자로 표시한다", () => {
    const playerStats: BattleStats = {
      damageDealt: 120,
      damageMitigated: 30,
      healingDone: 50,
      skillsUsed: 8,
    };
    const enemyStats: BattleStats = {
      damageDealt: 90,
      damageMitigated: 10,
      healingDone: 20,
      skillsUsed: 5,
    };
    render(
      <BattleStatsSummary
        player={makeCharacter()}
        enemy={makeCharacter({ name: "적" })}
        playerStats={playerStats}
        enemyStats={enemyStats}
        baseDelay={0}
      />,
    );
    // damageDealt
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
  });

  it("남은 체력에 현재 HP를 표시한다", () => {
    render(
      <BattleStatsSummary
        player={makeCharacter({ currentHp: 45 })}
        enemy={makeCharacter({ name: "적", currentHp: 60 })}
        playerStats={ZERO_STATS}
        enemyStats={ZERO_STATS}
        baseDelay={0}
      />,
    );
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("HP가 0 이하이면 0으로 표시한다", () => {
    render(
      <BattleStatsSummary
        player={makeCharacter({ currentHp: -5 })}
        enemy={makeCharacter({ name: "적", currentHp: 77 })}
        playerStats={ZERO_STATS}
        enemyStats={ZERO_STATS}
        baseDelay={0}
      />,
    );
    // "남은 체력" 행: grid [playerValue] [label] [enemyValue] 구조
    // player HP = Math.max(0, -5) = 0
    const hpLabel = screen.getByText("남은 체력");
    expect(hpLabel.previousElementSibling).toHaveTextContent("0");
    expect(hpLabel.nextElementSibling).toHaveTextContent("77");
  });
});
