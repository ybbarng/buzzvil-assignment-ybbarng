/** HpBar: progressbar ARIA 속성, 라벨, 값 표시 검증 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HpBar } from "./hp-bar";

describe("HpBar", () => {
  it("role=progressbar과 ARIA 속성을 갖는다", () => {
    render(<HpBar current={70} max={100} type="hp" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "70");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("HP 타입이면 aria-label이 '체력'이다", () => {
    render(<HpBar current={50} max={100} type="hp" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "체력",
    );
  });

  it("MP 타입이면 aria-label이 '마나'이다", () => {
    render(<HpBar current={30} max={50} type="mp" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "마나",
    );
  });

  it("현재값/최대값을 텍스트로 표시한다", () => {
    render(<HpBar current={42} max={80} type="hp" />);
    expect(screen.getByText("42/80")).toBeInTheDocument();
  });

  it("HP 타입은 'HP' 라벨을 표시한다", () => {
    render(<HpBar current={50} max={100} type="hp" />);
    expect(screen.getByText("HP")).toBeInTheDocument();
  });

  it("MP 타입은 'MP' 라벨을 표시한다", () => {
    render(<HpBar current={20} max={50} type="mp" />);
    expect(screen.getByText("MP")).toBeInTheDocument();
  });

  it("current가 0이면 aria-valuenow가 0이다", () => {
    render(<HpBar current={0} max={100} type="hp" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });
});
