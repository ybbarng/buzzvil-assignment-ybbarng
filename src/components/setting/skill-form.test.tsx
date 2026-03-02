import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SKILLS } from "@/constants/skills";
import type { Skill } from "@/types/skill";
import { SkillForm } from "./skill-form";

describe("SkillForm", () => {
  const defaultProps = {
    skills: [...DEFAULT_SKILLS],
    onAddSkill: vi.fn(),
    onRemoveSkill: vi.fn(),
    onPrev: vi.fn(),
    onNext: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("기본 스킬 2개의 효과가 표시된다", () => {
    render(<SkillForm {...defaultProps} />);
    expect(screen.getByText("대미지: 공격력(ATK) × 1")).toBeInTheDocument();
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

  it("기본 스킬에는 삭제 버튼이 없다", () => {
    render(<SkillForm {...defaultProps} />);
    expect(screen.queryByTestId("remove-skill-button")).not.toBeInTheDocument();
  });

  it("커스텀 스킬에는 삭제 버튼이 표시된다", () => {
    const customSkill: Skill = {
      name: "화염구",
      type: "attack",
      mpCost: 10,
      multiplier: 2.0,
      isDefault: false,
    };
    render(
      <SkillForm {...defaultProps} skills={[...DEFAULT_SKILLS, customSkill]} />,
    );
    expect(screen.getByTestId("remove-skill-button")).toBeInTheDocument();
  });

  it("삭제 버튼 클릭 시 onRemoveSkill이 호출된다", async () => {
    const user = userEvent.setup();
    const customSkill: Skill = {
      name: "화염구",
      type: "attack",
      mpCost: 10,
      multiplier: 2.0,
      isDefault: false,
    };
    render(
      <SkillForm {...defaultProps} skills={[...DEFAULT_SKILLS, customSkill]} />,
    );

    await user.click(screen.getByTestId("remove-skill-button"));
    expect(defaultProps.onRemoveSkill).toHaveBeenCalledWith(2);
  });

  it("스킬 추가 버튼이 표시된다", () => {
    render(<SkillForm {...defaultProps} />);
    expect(screen.getByTestId("add-skill-button")).toBeInTheDocument();
  });

  it("커스텀 스킬이 2개이면 추가 버튼이 숨겨진다", () => {
    const skills: Skill[] = [
      ...DEFAULT_SKILLS,
      {
        name: "화염구",
        type: "attack",
        mpCost: 10,
        multiplier: 2.0,
        isDefault: false,
      },
      {
        name: "치유",
        type: "heal",
        mpCost: 15,
        healAmount: 30,
        isDefault: false,
      },
    ];
    render(<SkillForm {...defaultProps} skills={skills} />);
    expect(screen.queryByTestId("add-skill-button")).not.toBeInTheDocument();
  });

  it("추가 버튼 클릭 시 스킬 생성 폼이 나타난다", async () => {
    const user = userEvent.setup();
    render(<SkillForm {...defaultProps} />);

    await user.click(screen.getByTestId("add-skill-button"));
    expect(screen.getByTestId("skill-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-skill-button")).toBeInTheDocument();
  });
});
