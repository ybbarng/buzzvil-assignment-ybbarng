import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DifficultyForm } from "./difficulty-form";

describe("DifficultyForm", () => {
  const defaultProps = {
    difficulty: "normal" as const,
    onSelect: vi.fn(),
    onPrev: vi.fn(),
    onStartBattle: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("3가지 난이도 버튼이 표시된다", () => {
    render(<DifficultyForm {...defaultProps} />);
    expect(screen.getByTestId("difficulty-easy")).toBeInTheDocument();
    expect(screen.getByTestId("difficulty-normal")).toBeInTheDocument();
    expect(screen.getByTestId("difficulty-hard")).toBeInTheDocument();
  });

  it("난이도 클릭 시 onSelect가 호출된다", async () => {
    const user = userEvent.setup();
    render(<DifficultyForm {...defaultProps} />);

    await user.click(screen.getByTestId("difficulty-easy"));
    expect(defaultProps.onSelect).toHaveBeenCalledWith("easy");

    await user.click(screen.getByTestId("difficulty-hard"));
    expect(defaultProps.onSelect).toHaveBeenCalledWith("hard");
  });

  it("선택된 난이도가 강조 표시된다", () => {
    render(<DifficultyForm {...defaultProps} difficulty="hard" />);
    const hardButton = screen.getByTestId("difficulty-hard");
    expect(hardButton.className).toContain("border-damage");
  });

  it("이전 버튼 클릭 시 onPrev가 호출된다", async () => {
    const user = userEvent.setup();
    render(<DifficultyForm {...defaultProps} />);

    await user.click(screen.getByTestId("prev-button"));
    expect(defaultProps.onPrev).toHaveBeenCalled();
  });

  it("전투 시작 버튼 클릭 시 onStartBattle이 호출된다", async () => {
    const user = userEvent.setup();
    render(<DifficultyForm {...defaultProps} />);

    await user.click(screen.getByTestId("start-battle-button"));
    expect(defaultProps.onStartBattle).toHaveBeenCalled();
  });

  it("적 이름이 난이도별로 표시된다", () => {
    render(<DifficultyForm {...defaultProps} />);
    expect(screen.getByText("훈련 로봇과 대전합니다")).toBeInTheDocument();
    expect(screen.getByText("전투 드론과 대전합니다")).toBeInTheDocument();
    expect(screen.getByText("타론 요원과 대전합니다")).toBeInTheDocument();
  });
});
