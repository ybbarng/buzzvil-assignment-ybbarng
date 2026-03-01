import { useState } from "react";
import { PresetHeroDetail } from "@/components/setting/preset-hero-card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getPresetsByRole,
  ROLE_COLORS,
  ROLE_LABELS,
} from "@/constants/presets";
import { cn } from "@/lib/utils";
import type { HeroPreset, HeroRole } from "@/types/preset";

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

function HeroGrid({
  role,
  selected,
  onHover,
}: {
  role: HeroRole;
  selected: HeroPreset | null;
  onHover: (hero: HeroPreset) => void;
}) {
  const heroes = getPresetsByRole(role);
  const half = Math.ceil(heroes.length / 2);
  const row1 = heroes.slice(0, half);
  const row2 = heroes.slice(half);

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${ROLE_ICON_COLORS[role]}`}
      >
        {ROLE_LABELS[role]}
      </span>
      <div className="flex flex-col gap-1">
        {[
          { key: "top", heroes: row1 },
          { key: "bottom", heroes: row2 },
        ].map(({ key, heroes: row }) => (
          <div key={key} className="flex gap-1">
            {row.map((hero) => (
              <button
                key={hero.id}
                type="button"
                onClick={() => onHover(hero)}
                className={cn(
                  "cursor-pointer px-2.5 py-1.5 text-[11px] font-medium text-text-primary transition-all",
                  selected?.id === hero.id
                    ? "border-2 border-accent-orange bg-accent-orange/20"
                    : "border border-transparent bg-bg-tertiary hover:bg-bg-tertiary/80",
                )}
              >
                {hero.name}
              </button>
            ))}
          </div>
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
          <div className="flex items-start justify-center gap-6">
            {ROLES.map((role) => (
              <HeroGrid
                key={role}
                role={role}
                selected={selected}
                onHover={setSelected}
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
