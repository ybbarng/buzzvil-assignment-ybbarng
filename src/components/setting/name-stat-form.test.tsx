import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_STATS } from "@/constants/stats";
import { NameStatForm } from "./name-stat-form";

describe("NameStatForm", () => {
  const defaultProps = {
    defaultName: "",
    defaultStats: DEFAULT_STATS,
    onSubmit: vi.fn(),
  };

  it("이름 입력란이 렌더링된다", () => {
    render(<NameStatForm {...defaultProps} />);
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
  });

  it("5개 스탯 입력란이 렌더링된다", () => {
    render(<NameStatForm {...defaultProps} />);
    for (const key of ["hp", "mp", "atk", "def", "spd"]) {
      expect(screen.getByTestId(`stat-${key}`)).toBeInTheDocument();
    }
  });

  it("잔여 포인트가 표시된다", () => {
    render(<NameStatForm {...defaultProps} />);
    expect(screen.getByTestId("remaining-points")).toBeInTheDocument();
  });

  it("초기 상태에서 잔여 포인트는 145이다", () => {
    render(<NameStatForm {...defaultProps} />);
    // 기본 스탯 합: 20+20+5+5+5 = 55, 잔여: 200-55 = 145
    expect(screen.getByTestId("remaining-points")).toHaveTextContent("145");
  });

  it("다음 버튼이 렌더링된다", () => {
    render(<NameStatForm {...defaultProps} />);
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });

  it("잔여 포인트가 0이 아니면 다음 버튼이 비활성화된다", () => {
    render(<NameStatForm {...defaultProps} />);
    expect(screen.getByTestId("next-button")).toBeDisabled();
  });

  it("스탯 값을 변경하면 잔여 포인트가 업데이트된다", () => {
    render(<NameStatForm {...defaultProps} />);

    const hpInput = screen.getByTestId("stat-hp");
    fireEvent.change(hpInput, { target: { value: "50" } });

    // 50+20+5+5+5 = 85, 잔여: 200-85 = 115
    expect(screen.getByTestId("remaining-points")).toHaveTextContent("115");
  });

  it("모든 포인트를 배분하면 다음 버튼이 활성화된다", async () => {
    const completeStats = { hp: 100, mp: 50, atk: 20, def: 15, spd: 15 };
    render(
      <NameStatForm
        defaultName="테스터"
        defaultStats={completeStats}
        onSubmit={defaultProps.onSubmit}
      />,
    );

    expect(screen.getByTestId("remaining-points")).toHaveTextContent("0");
    expect(screen.getByTestId("next-button")).toBeEnabled();
  });

  it("유효한 데이터로 제출하면 onSubmit이 호출된다", async () => {
    const onSubmit = vi.fn();
    const completeStats = { hp: 100, mp: 50, atk: 20, def: 15, spd: 15 };
    const user = userEvent.setup();

    render(
      <NameStatForm
        defaultName="테스터"
        defaultStats={completeStats}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByTestId("next-button"));
    expect(onSubmit).toHaveBeenCalledWith(
      { name: "테스터", stats: completeStats },
      expect.anything(),
    );
  });
});
