import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SKILLS } from "@/constants/skills";
import { SkillForm } from "./skill-form";

describe("SkillForm", () => {
  const defaultProps = {
    skills: [...DEFAULT_SKILLS],
    onPrev: vi.fn(),
    onNext: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("기본 스킬 2개의 효과가 표시된다", () => {
    render(<SkillForm {...defaultProps} />);
    expect(screen.getByText("ATK × 1 데미지")).toBeInTheDocument();
    expect(screen.getByText("피해 50% 감소")).toBeInTheDocument();
  });

  it("이전/다음 버튼이 표시된다", () => {
    render(<SkillForm {...defaultProps} />);
    expect(screen.getByTestId("prev-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });

  it("이전 버튼 클릭 시 onPrev가 호출된다", async () => {
    const user = userEvent.setup();
    render(<SkillForm {...defaultProps} />);

    await user.click(screen.getByTestId("prev-button"));
    expect(defaultProps.onPrev).toHaveBeenCalled();
  });

  it("다음 버튼 클릭 시 onNext가 호출된다", async () => {
    const user = userEvent.setup();
    render(<SkillForm {...defaultProps} />);

    await user.click(screen.getByTestId("next-button"));
    expect(defaultProps.onNext).toHaveBeenCalled();
  });
});
