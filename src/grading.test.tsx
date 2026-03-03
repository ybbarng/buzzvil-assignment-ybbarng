import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { useBattleStore } from "./stores/battle-store";
import { allocateStats, resetStores, setStatValue } from "./test/helpers";

/**
 * 자동 채점 시나리오 시뮬레이션
 *
 * 이 테스트는 외부 자동 채점 스크립트가 data-testid를 통해 앱을 검증하는
 * 시나리오를 재현한다. 채점 환경에서의 동작을 보장하는 것이 목적이므로,
 * 개별 컴포넌트의 기능 검증(접근성, 상태 변화, 엣지 케이스 등)은
 * 각 컴포넌트 테스트 파일에서 독립적으로 수행한다.
 *
 * 일부 assertion이 컴포넌트 테스트와 겹칠 수 있지만,
 * 이 파일은 "채점 스크립트 관점의 통합 흐름"을,
 * 컴포넌트 테스트는 "개별 기능의 단위 검증"을 담당하므로 목적이 다르다.
 */

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
      // 기본값 합계 55, 잔여: 200-55 = 145
      expect(screen.getByTestId("remaining-points")).toHaveTextContent("145");

      setStatValue("stat-hp", 60);
      // 60+20+5+5+5 = 95, 잔여: 200-95 = 105
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

      // 잔여: 200-200 = 0
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

      expect(await screen.findByTestId("round-display")).toBeInTheDocument();
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
      // lazy 로딩 대기
      await screen.findByTestId("round-display");
      // 테스트 환경에서는 애니메이션 타이머 없이 즉시 이벤트 처리
      useBattleStore.getState().setAnimationEnabled(false);
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

      // 전투 종료 + 결과 화면 lazy 로딩 대기
      await waitFor(() => {
        expect(screen.queryByTestId("skill-button-0")).not.toBeInTheDocument();
      });

      expect(await screen.findByTestId("result-title")).toBeInTheDocument();
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
      // lazy 로딩 대기
      await screen.findByTestId("round-display");
      useBattleStore.getState().setAnimationEnabled(false);

      for (let i = 0; i < 20; i++) {
        const button = screen.queryByTestId("skill-button-0");
        if (!button) break;
        await userEvent.click(button);
      }
      expect(screen.queryByTestId("skill-button-0")).not.toBeInTheDocument();
      // 결과 화면 lazy 로딩 대기
      await screen.findByTestId("result-title");
    });

    it("승리 시 result-title에 '승리'가 표시된다", () => {
      expect(screen.getByTestId("result-title")).toHaveTextContent("승리");
    });

    it("restart-button을 누르면 세팅 화면으로 돌아간다", async () => {
      await userEvent.click(screen.getByTestId("restart-button"));
      expect(screen.getByTestId("name-input")).toBeInTheDocument();
      expect(screen.getByTestId("next-button")).toBeInTheDocument();
    });
  });

  describe("prefers-reduced-motion 전투 가속", () => {
    it("prefers-reduced-motion 환경에서 수동 설정 없이 전투가 즉시 진행된다", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.9);

      render(<App />);
      await userEvent.type(screen.getByTestId("name-input"), "테스터");
      allocateStats();
      await userEvent.click(screen.getByTestId("next-button"));
      await userEvent.click(screen.getByTestId("next-button"));
      await userEvent.click(screen.getByTestId("difficulty-easy"));
      await userEvent.click(screen.getByTestId("start-battle-button"));
      await screen.findByTestId("round-display");

      // setAnimationEnabled(false)를 수동 호출하지 않음 —
      // prefers-reduced-motion이 활성화된 환경에서는 BattleScreen이
      // 자동으로 animationEnabled를 비활성화하여 이벤트를 즉시 처리해야 한다.
      expect(useBattleStore.getState().animationEnabled).toBe(false);

      for (let i = 0; i < 20; i++) {
        const button = screen.queryByTestId("skill-button-0");
        if (!button) break;
        await userEvent.click(button);
      }

      await waitFor(() => {
        expect(screen.queryByTestId("skill-button-0")).not.toBeInTheDocument();
      });

      expect(await screen.findByTestId("result-title")).toBeInTheDocument();
      expect(screen.getByTestId("result-turns")).toBeInTheDocument();
      expect(screen.getByTestId("restart-button")).toBeInTheDocument();
    });
  });
});
