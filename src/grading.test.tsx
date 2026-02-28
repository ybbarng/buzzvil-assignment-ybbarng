import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { useBattleStore } from "./stores/battle-store";
import { useGameStore } from "./stores/game-store";
import { useSettingStore } from "./stores/setting-store";

/**
 * 자동 채점 시나리오 시뮬레이션
 * data-testid만 사용하여 채점 스크립트의 동작을 재현합니다.
 */

function resetStores() {
  useGameStore.getState().restart();
  useSettingStore.getState().reset();
  useBattleStore.getState().reset();
}

/** 스탯 인풋의 값을 변경한다 */
function setStatValue(testId: string, value: number) {
  fireEvent.change(screen.getByTestId(testId), {
    target: { value: String(value) },
  });
}

/** 스탯을 총 200으로 배분한다 (HP 60, MP 50, ATK 30, DEF 30, SPD 30) */
function allocateStats() {
  setStatValue("stat-hp", 60);
  setStatValue("stat-mp", 50);
  setStatValue("stat-atk", 30);
  setStatValue("stat-def", 30);
  setStatValue("stat-spd", 30);
}

describe("자동 채점 시나리오", () => {
  afterEach(() => {
    resetStores();
    vi.restoreAllMocks();
  });

  describe("세팅 Step 1: 이름 + 스탯 배분", () => {
    it("name-input에 이름을 입력할 수 있다", async () => {
      render(<App />);
      const nameInput = screen.getByTestId("name-input");
      await userEvent.type(nameInput, "테스터");
      expect(nameInput).toHaveValue("테스터");
    });

    it("스탯 인풋으로 값을 변경하면 remaining-points가 갱신된다", () => {
      render(<App />);
      // 기본값 합계 55, 잔여 145
      expect(screen.getByTestId("remaining-points")).toHaveTextContent("145");

      setStatValue("stat-hp", 60);
      // 60+20+5+5+5 = 95, 잔여 105
      expect(screen.getByTestId("remaining-points")).toHaveTextContent("105");
    });

    it("잔여 포인트가 0이 아니면 next-button이 비활성화된다", () => {
      render(<App />);
      expect(screen.getByTestId("next-button")).toBeDisabled();
    });

    it("200포인트를 모두 배분하면 next-button이 활성화되고 다음 스텝으로 진행한다", async () => {
      render(<App />);
      await userEvent.type(screen.getByTestId("name-input"), "테스터");
      allocateStats();

      expect(screen.getByTestId("remaining-points")).toHaveTextContent("0");
      expect(screen.getByTestId("next-button")).toBeEnabled();

      await userEvent.click(screen.getByTestId("next-button"));

      // Step 2로 진행: add-skill-button이 보여야 함
      expect(screen.getByTestId("add-skill-button")).toBeInTheDocument();
    });
  });

  describe("세팅 Step 2: 스킬 설정", () => {
    beforeEach(async () => {
      render(<App />);
      await userEvent.type(screen.getByTestId("name-input"), "테스터");
      allocateStats();
      await userEvent.click(screen.getByTestId("next-button"));
    });

    it("커스텀 스킬을 생성할 수 있다", async () => {
      await userEvent.click(screen.getByTestId("add-skill-button"));
      await userEvent.type(screen.getByTestId("skill-name-input"), "강타");
      await userEvent.click(screen.getByTestId("submit-skill-button"));

      // 스킬이 추가되면 remove-skill-button이 나타남
      expect(screen.getByTestId("remove-skill-button")).toBeInTheDocument();
    });

    it("커스텀 스킬을 삭제할 수 있다", async () => {
      await userEvent.click(screen.getByTestId("add-skill-button"));
      await userEvent.type(screen.getByTestId("skill-name-input"), "강타");
      await userEvent.click(screen.getByTestId("submit-skill-button"));

      await userEvent.click(screen.getByTestId("remove-skill-button"));
      expect(
        screen.queryByTestId("remove-skill-button"),
      ).not.toBeInTheDocument();
    });

    it("next-button으로 Step 3으로 진행한다", async () => {
      await userEvent.click(screen.getByTestId("next-button"));
      expect(screen.getByTestId("difficulty-easy")).toBeInTheDocument();
    });

    it("prev-button으로 Step 1로 돌아가면 입력값이 보존된다", async () => {
      await userEvent.click(screen.getByTestId("prev-button"));
      expect(screen.getByTestId("name-input")).toHaveValue("테스터");
    });
  });

  describe("세팅 Step 3: 난이도 선택", () => {
    beforeEach(async () => {
      render(<App />);
      await userEvent.type(screen.getByTestId("name-input"), "테스터");
      allocateStats();
      await userEvent.click(screen.getByTestId("next-button"));
      await userEvent.click(screen.getByTestId("next-button"));
    });

    it("난이도 버튼이 3개 존재한다", () => {
      expect(screen.getByTestId("difficulty-easy")).toBeInTheDocument();
      expect(screen.getByTestId("difficulty-normal")).toBeInTheDocument();
      expect(screen.getByTestId("difficulty-hard")).toBeInTheDocument();
    });

    it("start-battle-button으로 전투를 시작한다", async () => {
      await userEvent.click(screen.getByTestId("difficulty-easy"));
      await userEvent.click(screen.getByTestId("start-battle-button"));

      expect(screen.getByTestId("round-display")).toBeInTheDocument();
      expect(screen.getByTestId("player-panel")).toBeInTheDocument();
      expect(screen.getByTestId("enemy-panel")).toBeInTheDocument();
    });
  });

  describe("전투", () => {
    beforeEach(async () => {
      // 적 AI 고정 (항상 기본 공격)
      vi.spyOn(Math, "random").mockReturnValue(0.9);

      render(<App />);
      await userEvent.type(screen.getByTestId("name-input"), "테스터");
      allocateStats();
      await userEvent.click(screen.getByTestId("next-button"));
      await userEvent.click(screen.getByTestId("next-button"));
      await userEvent.click(screen.getByTestId("difficulty-easy"));
      await userEvent.click(screen.getByTestId("start-battle-button"));
    });

    it("player-name과 enemy-name이 표시된다", () => {
      expect(screen.getByTestId("player-name")).toHaveTextContent("테스터");
      expect(screen.getByTestId("enemy-name")).toHaveTextContent("훈련 로봇");
    });

    it("round-display가 표시된다", () => {
      expect(screen.getByTestId("round-display")).toHaveTextContent("라운드");
    });

    it("skill-button이 스킬 수만큼 존재한다", () => {
      expect(screen.getByTestId("skill-button-0")).toBeInTheDocument();
      expect(screen.getByTestId("skill-button-1")).toBeInTheDocument();
    });

    it("skill-button-0 클릭으로 공격하면 battle-log에 기록된다", async () => {
      await userEvent.click(screen.getByTestId("skill-button-0"));
      const log = screen.getByTestId("battle-log");
      expect(log.textContent).toContain("테스터");
    });

    it("공격을 반복하면 전투가 종료되고 결과 화면이 나타난다", async () => {
      for (let i = 0; i < 20; i++) {
        const button = screen.queryByTestId("skill-button-0");
        if (!button) break;
        await userEvent.click(button);
      }

      // 전투가 실제로 종료되었는지 확인
      expect(screen.queryByTestId("skill-button-0")).not.toBeInTheDocument();

      // 결과 화면의 요소가 나타나야 함
      expect(screen.getByTestId("result-title")).toBeInTheDocument();
      expect(screen.getByTestId("result-turns")).toBeInTheDocument();
      expect(screen.getByTestId("restart-button")).toBeInTheDocument();
    });
  });

  describe("결과 화면", () => {
    beforeEach(async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.9);

      render(<App />);
      await userEvent.type(screen.getByTestId("name-input"), "테스터");
      allocateStats();
      await userEvent.click(screen.getByTestId("next-button"));
      await userEvent.click(screen.getByTestId("next-button"));
      await userEvent.click(screen.getByTestId("difficulty-easy"));
      await userEvent.click(screen.getByTestId("start-battle-button"));

      for (let i = 0; i < 20; i++) {
        const button = screen.queryByTestId("skill-button-0");
        if (!button) break;
        await userEvent.click(button);
      }
      expect(screen.queryByTestId("skill-button-0")).not.toBeInTheDocument();
    });

    it("승리 시 result-title에 '승리'가 표시된다", () => {
      expect(screen.getByTestId("result-title")).toHaveTextContent("승리");
    });

    it("restart-button을 누르면 세팅 화면으로 돌아간다", async () => {
      await userEvent.click(screen.getByTestId("restart-button"));
      expect(screen.getByTestId("name-input")).toBeInTheDocument();
    });
  });
});
