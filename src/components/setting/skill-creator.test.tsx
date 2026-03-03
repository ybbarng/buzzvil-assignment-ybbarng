/** SkillCreator: 커스텀 스킬 생성 폼 렌더링, 제출, 유효성 검증 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SkillCreator } from "./skill-creator";

describe("SkillCreator", () => {
  const defaultProps = {
    onAdd: vi.fn(),
    onCancel: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("skill-name-input과 submit-skill-button을 렌더링한다", () => {
    render(<SkillCreator {...defaultProps} />);
    expect(screen.getByTestId("skill-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-skill-button")).toBeInTheDocument();
  });

  it("취소 버튼 클릭 시 onCancel이 호출된다", async () => {
    render(<SkillCreator {...defaultProps} />);
    await userEvent.click(screen.getByText("취소"));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it("이름을 입력하고 제출하면 onAdd가 attack 스킬로 호출된다", async () => {
    render(<SkillCreator {...defaultProps} />);
    await userEvent.type(screen.getByTestId("skill-name-input"), "강타");
    await userEvent.click(screen.getByTestId("submit-skill-button"));

    expect(defaultProps.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "강타",
        type: "attack",
        isDefault: false,
      }),
    );
  });

  it("이름이 비어있으면 제출 시 유효성 에러와 aria-invalid가 표시된다", async () => {
    render(<SkillCreator {...defaultProps} />);
    await userEvent.click(screen.getByTestId("submit-skill-button"));

    expect(defaultProps.onAdd).not.toHaveBeenCalled();
    expect(screen.getByText("스킬 이름을 입력해주세요")).toBeInTheDocument();

    const input = screen.getByTestId("skill-name-input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "skill-name-error");
  });

  it("기본 타입이 attack이면 공격 배율 슬라이더가 표시된다", () => {
    render(<SkillCreator {...defaultProps} />);
    expect(screen.getByText("공격 배율")).toBeInTheDocument();
  });

  it("마나(MP) 소모량 슬라이더가 표시된다", () => {
    render(<SkillCreator {...defaultProps} />);
    expect(screen.getByText("마나(MP) 소모량")).toBeInTheDocument();
  });
});
