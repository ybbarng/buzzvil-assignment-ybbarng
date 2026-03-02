import { useState } from "react";
import roleDamageIcon from "@/assets/role-damage.svg";
import roleSupportIcon from "@/assets/role-support.svg";
import roleTankIcon from "@/assets/role-tank.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GameButton } from "@/components/ui/game-button";
import {
  HERO_PRESETS,
  ROLE_LABELS,
  ROLE_SUB_ROLES,
  SUB_ROLE_LABELS,
  getPresetsBySubRole,
} from "@/constants/presets";
import {
  SKILL_TYPE_COLORS,
  SKILL_TYPE_ICONS,
  SKILL_TYPE_LABELS,
} from "@/constants/skills";
import {
  getSkillPresetByHeroId,
  presetEntryToSkill,
} from "@/constants/skill-presets";
import { STAT_LABELS } from "@/constants/stats";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import { cn } from "@/lib/utils";
import type { HeroRole, HeroSubRole } from "@/types/preset";
import type { Skill } from "@/types/skill";
import type { SkillPresetEntry } from "@/types/skill-preset";

interface SkillPresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null이면 전체 영웅 탐색 모드, 값이 있으면 해당 영웅 스킬만 표시 */
  presetId: string | null;
  /** 이미 장착된 커스텀 스킬 이름 목록 (중복 방지용) */
  equippedSkillNames: string[];
  onSelect: (skill: Skill) => void;
}

const ROLES: HeroRole[] = ["tank", "damage", "support"];

const ROLE_ICON_URLS: Record<HeroRole, string> = {
  tank: roleTankIcon,
  damage: roleDamageIcon,
  support: roleSupportIcon,
};

function getSkillDescription(skill: SkillPresetEntry): string {
  switch (skill.type) {
    case "attack":
      return `${STAT_LABELS.atk.ko} × ${skill.multiplier}`;
    case "defend":
      return "받는 피해 50% 감소";
    case "heal":
      return `체력(HP) ${skill.healAmount} 회복`;
    case "buff": {
      const { ko } = STAT_LABELS[skill.target];
      return `${skill.duration}턴 ${ko} +${skill.value}`;
    }
    case "debuff": {
      const { ko } = STAT_LABELS[skill.target];
      return `${skill.duration}턴 ${ko} -${skill.value}`;
    }
  }
}

function SkillPresetItem({
  skill,
  disabled,
  onSelect,
}: {
  skill: SkillPresetEntry;
  disabled: boolean;
  onSelect: () => void;
}) {
  const TypeIcon = SKILL_TYPE_ICONS[skill.type];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        `${SKEW} w-full border-l-2 px-4 py-3 text-left transition-all`,
        SKILL_TYPE_COLORS[skill.type].border,
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer bg-bg-tertiary hover:bg-bg-tertiary/80",
      )}
    >
      <div className={`${SKEW_TEXT} space-y-0.5`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{skill.name}</span>
          <TypeIcon
            className={`size-4 ${SKILL_TYPE_COLORS[skill.type].text}`}
          />
          <span
            className={`text-xs ${SKILL_TYPE_COLORS[skill.type].text} opacity-80`}
          >
            {SKILL_TYPE_LABELS[skill.type]}
          </span>
          <span className="text-xs text-mp">MP {skill.mpCost}</span>
        </div>
        <p className="text-sm text-text-secondary">
          {getSkillDescription(skill)}
        </p>
        {disabled && (
          <p className="text-xs text-text-muted">이미 장착됨</p>
        )}
      </div>
    </button>
  );
}

function HeroBrowser({
  selectedHeroId,
  onSelectHero,
}: {
  selectedHeroId: string | null;
  onSelectHero: (heroId: string) => void;
}) {
  return (
    <div className="space-y-3">
      {ROLES.map((role) => (
        <div key={role} className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/40">
              <img
                src={ROLE_ICON_URLS[role]}
                alt={ROLE_LABELS[role]}
                className="h-3 w-3"
              />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-white">
              {ROLE_LABELS[role]}
            </span>
          </div>
          {ROLE_SUB_ROLES[role].map((subRole: HeroSubRole) => {
            const heroes = getPresetsBySubRole(subRole);
            return (
              <div key={subRole} className="flex items-start gap-2">
                <span className="shrink-0 py-1.5 text-xs tracking-wide text-white">
                  {SUB_ROLE_LABELS[subRole]}
                </span>
                <div className="flex flex-wrap gap-1">
                  {heroes.map((hero) => (
                    <button
                      key={hero.id}
                      type="button"
                      onClick={() => onSelectHero(hero.id)}
                      className={cn(
                        `${SKEW} cursor-pointer whitespace-nowrap px-2.5 py-1.5 text-[11px] font-medium text-text-primary transition-all border-2`,
                        selectedHeroId === hero.id
                          ? "border-accent-orange bg-accent-orange/20"
                          : "border-transparent bg-bg-tertiary hover:bg-bg-tertiary/80",
                      )}
                    >
                      <span className={`${SKEW_TEXT} block`}>{hero.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function SkillPresetDialog({
  open,
  onOpenChange,
  presetId,
  equippedSkillNames,
  onSelect,
}: SkillPresetDialogProps) {
  const [browseHeroId, setBrowseHeroId] = useState<string | null>(null);

  const effectiveHeroId = presetId ?? browseHeroId;
  const preset = effectiveHeroId
    ? getSkillPresetByHeroId(effectiveHeroId)
    : null;
  const heroName = effectiveHeroId
    ? HERO_PRESETS.find((h) => h.id === effectiveHeroId)?.name
    : null;

  const handleOpenChange = (value: boolean) => {
    if (!value) setBrowseHeroId(null);
    onOpenChange(value);
  };

  const handleSelect = (entry: SkillPresetEntry) => {
    onSelect(presetEntryToSkill(entry));
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto border-accent-orange/30 bg-bg-secondary sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold tracking-wider text-accent-orange uppercase">
            {heroName
              ? `${heroName} 스킬 프리셋`
              : "프리셋 스킬 선택"}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {presetId
              ? "장착할 스킬을 선택하세요."
              : "영웅을 선택한 후 스킬을 장착하세요."}
          </DialogDescription>
        </DialogHeader>

        {/* 직접 입력 모드: 영웅 목록 표시 */}
        {!presetId && (
          <HeroBrowser
            selectedHeroId={browseHeroId}
            onSelectHero={setBrowseHeroId}
          />
        )}

        {/* 스킬 목록 */}
        {preset && (
          <div className="space-y-2">
            {!presetId && heroName && (
              <h3 className="text-xs font-bold tracking-wider text-text-secondary uppercase">
                {heroName}의 스킬
              </h3>
            )}
            {preset.skills.map((skill) => {
              const isEquipped = equippedSkillNames.includes(skill.name);
              return (
                <SkillPresetItem
                  key={skill.name}
                  skill={skill}
                  disabled={isEquipped}
                  onSelect={() => handleSelect(skill)}
                />
              );
            })}
          </div>
        )}

        {/* 영웅 미선택 안내 */}
        {!presetId && !browseHeroId && (
          <p className="py-4 text-center text-sm text-text-muted">
            위에서 영웅을 선택하세요
          </p>
        )}

        <GameButton
          type="button"
          variant="blue"
          className="mt-2 w-full"
          onClick={() => handleOpenChange(false)}
        >
          닫기
        </GameButton>
      </DialogContent>
    </Dialog>
  );
}
