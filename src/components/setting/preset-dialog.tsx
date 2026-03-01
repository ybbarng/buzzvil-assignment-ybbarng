import { useState } from "react";
import { PresetHeroDetail } from "@/components/setting/preset-hero-card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getPresetsBySubRole,
  ROLE_COLORS,
  ROLE_LABELS,
  ROLE_SUB_ROLES,
  SUB_ROLE_LABELS,
} from "@/constants/presets";
import { cn } from "@/lib/utils";
import type { HeroPreset, HeroRole, HeroSubRole } from "@/types/preset";

interface PresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (hero: HeroPreset) => void;
}

const ROLES: HeroRole[] = ["tank", "damage", "support"];

const ROLE_ICON_COLORS: Record<HeroRole, string> = {
  tank: "text-accent-blue",
  damage: "text-damage",
  support: "text-heal",
};

function SubRoleGroup({
  subRole,
  roleColor,
  selected,
  onSelect,
}: {
  subRole: HeroSubRole;
  roleColor: string;
  selected: HeroPreset | null;
  onSelect: (hero: HeroPreset) => void;
}) {
  const heroes = getPresetsBySubRole(subRole);

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-[10px] font-medium tracking-wide ${roleColor}`}>
        {SUB_ROLE_LABELS[subRole]}
      </span>
      <div className="flex flex-wrap gap-1">
        {heroes.map((hero) => (
          <button
            key={hero.id}
            type="button"
            onClick={() => onSelect(hero)}
            className={cn(
              "cursor-pointer whitespace-nowrap rounded-sm px-2.5 py-1.5 text-[11px] font-medium text-text-primary transition-all",
              "border-2",
              selected?.id === hero.id
                ? "relative z-10 origin-bottom border-accent-orange bg-accent-orange/20 [transform:scale(1.33)]"
                : "border-transparent bg-bg-tertiary hover:bg-bg-tertiary/80",
            )}
          >
            {hero.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function RoleSection({
  role,
  selected,
  onSelect,
}: {
  role: HeroRole;
  selected: HeroPreset | null;
  onSelect: (hero: HeroPreset) => void;
}) {
  const subRoles = ROLE_SUB_ROLES[role];

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${ROLE_ICON_COLORS[role]}`}
      >
        {ROLE_LABELS[role]}
      </span>
      <div className="flex flex-col gap-1">
        {subRoles.map((subRole) => (
          <SubRoleGroup
            key={subRole}
            subRole={subRole}
            roleColor={ROLE_ICON_COLORS[role]}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function PresetDialog({
  open,
  onOpenChange,
  onSelect,
}: PresetDialogProps) {
  const [selected, setSelected] = useState<HeroPreset | null>(null);

  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
      setSelected(null);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) setSelected(null);
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="flex h-[90vh] w-[95vw] max-w-[95vw] flex-col border-border bg-bg-primary p-0 sm:max-w-[95vw]"
      >
        <DialogTitle className="sr-only">오버워치 영웅 프리셋</DialogTitle>

        {/* 메인 영역: 영웅 정보 */}
        <div className="relative flex flex-1 items-end justify-end overflow-hidden px-8 pb-4">
          {/* 배경 그라데이션 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-bg-tertiary/30" />

          {selected ? (
            <div className="relative z-10 flex w-full items-end justify-between gap-8">
              {/* 왼쪽: 영웅 이름 + 설명 */}
              <div className="flex flex-col gap-2">
                <h2 className="text-5xl font-black tracking-tight text-text-primary uppercase">
                  {selected.name}
                </h2>
                <p className="max-w-md text-sm text-text-secondary">
                  {selected.description}
                </p>
              </div>

              {/* 오른쪽: 역할군 + 스탯 */}
              <div className="flex w-64 shrink-0 flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-1.5 rounded-sm ${ROLE_COLORS[selected.role]}`}
                  />
                  <span
                    className={`text-sm font-bold uppercase tracking-wider ${ROLE_ICON_COLORS[selected.role]}`}
                  >
                    {ROLE_LABELS[selected.role]}
                  </span>
                  <span className="text-xs text-text-muted">
                    · {SUB_ROLE_LABELS[selected.subRole]}
                  </span>
                </div>
                <PresetHeroDetail hero={selected} />
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex w-full items-center justify-center py-16">
              <p className="text-lg text-text-muted">영웅을 선택하세요</p>
            </div>
          )}
        </div>

        {/* 하단: 영웅 그리드 + 선택 버튼 */}
        <div className="border-t border-border bg-bg-secondary/80 px-6 py-4">
          <div className="flex items-start justify-center gap-8">
            {ROLES.map((role) => (
              <RoleSection
                key={role}
                role={role}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              disabled={!selected}
              onClick={handleSelect}
              className="min-w-48 cursor-pointer bg-accent-orange px-8 py-2.5 text-sm font-bold text-white uppercase tracking-wider transition-all hover:bg-accent-orange-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              선택
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
