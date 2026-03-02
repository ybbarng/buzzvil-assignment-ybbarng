import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getSkillPresetByHeroId } from "@/constants/skill-presets";
import { SkillPresetDialog } from "./skill-preset-dialog";

function getDvaPreset() {
  const preset = getSkillPresetByHeroId("dva");
  if (!preset) throw new Error("dva preset not found");
  return preset;
}

describe("SkillPresetDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    presetId: null as string | null,
    equippedSkillKeys: [] as string[],
    onSelect: vi.fn(),
  };

  describe("프리셋 영웅 모드 (presetId 지정)", () => {
    it("해당 영웅의 스킬이 표시된다", () => {
      render(<SkillPresetDialog {...defaultProps} presetId="dva" />);

      const preset = getDvaPreset();
      for (const skill of preset.skills) {
        expect(screen.getByText(skill.name)).toBeInTheDocument();
      }
    });

    it("영웅 브라우저가 표시되지 않는다", () => {
      render(<SkillPresetDialog {...defaultProps} presetId="dva" />);

      expect(
        screen.queryByText("위에서 영웅을 선택하세요"),
      ).not.toBeInTheDocument();
    });

    it("다이얼로그 제목에 영웅 이름이 포함된다", () => {
      render(<SkillPresetDialog {...defaultProps} presetId="dva" />);

      expect(screen.getByText("D.Va 스킬 프리셋")).toBeInTheDocument();
    });
  });

  describe("전체 탐색 모드 (presetId null)", () => {
    it("영웅 미선택 시 안내 문구가 표시된다", () => {
      render(<SkillPresetDialog {...defaultProps} />);

      expect(screen.getByText("위에서 영웅을 선택하세요")).toBeInTheDocument();
    });

    it("영웅을 선택하면 해당 영웅의 스킬이 표시된다", async () => {
      const user = userEvent.setup();
      render(<SkillPresetDialog {...defaultProps} />);

      await user.click(screen.getByText("D.Va"));

      const preset = getDvaPreset();
      for (const skill of preset.skills) {
        expect(screen.getByText(skill.name)).toBeInTheDocument();
      }
    });

    it("스킬 선택 후 재오픈 시 마지막 선택 영웅이 유지된다", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <SkillPresetDialog
          {...defaultProps}
          onOpenChange={onOpenChange}
          onSelect={vi.fn()}
        />,
      );

      // 영웅 선택 → 스킬 선택 → 다이얼로그 닫힘
      await user.click(screen.getByText("D.Va"));
      const preset = getDvaPreset();
      await user.click(screen.getByText(preset.skills[0].name));
      expect(onOpenChange).toHaveBeenCalledWith(false);

      // 닫힌 상태에서 재오픈
      rerender(
        <SkillPresetDialog
          {...defaultProps}
          open={true}
          onOpenChange={onOpenChange}
          onSelect={vi.fn()}
        />,
      );

      // 영웅을 다시 선택하지 않아도 스킬 목록이 표시된다
      for (const skill of preset.skills) {
        expect(screen.getByText(skill.name)).toBeInTheDocument();
      }
    });
  });

  describe("스킬 선택", () => {
    it("스킬 클릭 시 onSelect가 호출되고 다이얼로그가 닫힌다", async () => {
      const onSelect = vi.fn();
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <SkillPresetDialog
          {...defaultProps}
          presetId="dva"
          onSelect={onSelect}
          onOpenChange={onOpenChange}
        />,
      );

      const preset = getDvaPreset();
      await user.click(screen.getByText(preset.skills[0].name));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect.mock.calls[0][0]).toMatchObject({
        name: preset.skills[0].name,
        isDefault: false,
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("이미 장착된 스킬은 비활성화된다", () => {
      const preset = getDvaPreset();
      const firstSkill = preset.skills[0];
      const equippedKey = `${firstSkill.name}:${firstSkill.type}`;

      render(
        <SkillPresetDialog
          {...defaultProps}
          presetId="dva"
          equippedSkillKeys={[equippedKey]}
        />,
      );

      expect(screen.getByText("이미 장착됨")).toBeInTheDocument();
    });

    it("이미 장착된 스킬은 클릭해도 onSelect가 호출되지 않는다", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();
      const preset = getDvaPreset();
      const firstSkill = preset.skills[0];
      const equippedKey = `${firstSkill.name}:${firstSkill.type}`;

      render(
        <SkillPresetDialog
          {...defaultProps}
          presetId="dva"
          equippedSkillKeys={[equippedKey]}
          onSelect={onSelect}
        />,
      );

      const disabledButton = screen
        .getByText(firstSkill.name)
        .closest("button");
      if (!disabledButton) throw new Error("button not found");
      await user.click(disabledButton);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  it("닫기 버튼 클릭 시 onOpenChange(false)가 호출된다", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(<SkillPresetDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
