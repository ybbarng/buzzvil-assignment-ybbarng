/** BattleScreen: 전투 화면 렌더링 및 기본 상호작용 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_SKILLS } from "@/constants/skills";
import { useBattleStore } from "@/stores/battle-store";
import { useSettingStore } from "@/stores/setting-store";
import { resetStores } from "@/test/helpers";
import { BattleScreen } from "./battle-screen";

function setupBattle() {
  useSettingStore.setState({
    name: "테스터",
    stats: { hp: 60, mp: 50, atk: 30, def: 30, spd: 30 },
    skills: DEFAULT_SKILLS,
    difficulty: "easy",
  });
  useBattleStore.getState().setAnimationEnabled(false);
}

describe("BattleScreen", () => {
  afterEach(() => {
    resetStores();
  });

  it("전투 초기화 후 round-display, player-panel, enemy-panel을 렌더링한다", () => {
    setupBattle();
    render(<BattleScreen />);

    expect(screen.getByTestId("round-display")).toHaveTextContent("라운드 1");
    expect(screen.getByTestId("player-panel")).toBeInTheDocument();
    expect(screen.getByTestId("enemy-panel")).toBeInTheDocument();
  });

  it("플레이어와 적 이름을 표시한다", () => {
    setupBattle();
    render(<BattleScreen />);

    expect(screen.getByTestId("player-name")).toHaveTextContent("테스터");
    expect(screen.getByTestId("enemy-name")).toHaveTextContent("훈련 로봇");
  });

  it("battle-log 영역을 렌더링한다", () => {
    setupBattle();
    render(<BattleScreen />);

    expect(screen.getByTestId("battle-log")).toBeInTheDocument();
  });

  it("스킬 버튼(skill-button-0, skill-button-1)이 렌더링된다", () => {
    setupBattle();
    render(<BattleScreen />);

    expect(screen.getByTestId("skill-button-0")).toBeInTheDocument();
    expect(screen.getByTestId("skill-button-1")).toBeInTheDocument();
  });

  it("공격 버튼 클릭 시 라운드가 진행된다", async () => {
    setupBattle();
    render(<BattleScreen />);

    await userEvent.click(screen.getByTestId("skill-button-0"));

    // 애니메이션 비활성화 상태이므로 즉시 라운드 2로 진행
    expect(screen.getByTestId("round-display")).toHaveTextContent("라운드 2");
  });

  it("전투 종료 시 액션 패널이 사라진다", async () => {
    setupBattle();
    render(<BattleScreen />);

    // 기본 공격을 반복하여 전투 종료
    for (let i = 0; i < 25; i++) {
      const btn = screen.queryByTestId("skill-button-0");
      if (!btn) break;
      await userEvent.click(btn);
    }

    expect(screen.queryByTestId("skill-button-0")).not.toBeInTheDocument();
  });
});
