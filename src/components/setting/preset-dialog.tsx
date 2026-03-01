import { PresetHeroDetail } from "@/components/setting/preset-hero-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  getPresetsByRole,
  ROLE_COLORS,
  ROLE_LABELS,
} from "@/constants/presets";
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

function RoleSection({
  role,
  onSelect,
}: {
  role: HeroRole;
  onSelect: (hero: HeroPreset) => void;
}) {
  const heroes = getPresetsByRole(role);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-1 rounded-sm ${ROLE_COLORS[role]}`} />
        <span
          className={`text-xs font-bold uppercase tracking-wider ${ROLE_ICON_COLORS[role]}`}
        >
          {ROLE_LABELS[role]}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {heroes.map((hero) => (
          <HoverCard key={hero.id} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                onClick={() => onSelect(hero)}
                className="cursor-pointer rounded-md border border-border bg-bg-tertiary px-2.5 py-1.5 text-xs font-medium text-text-primary transition-all hover:border-accent-orange hover:bg-accent-orange/10 hover:text-accent-orange"
              >
                {hero.name}
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              side="top"
              className="w-56 border-border bg-bg-secondary p-3"
            >
              <PresetHeroDetail hero={hero} />
            </HoverCardContent>
          </HoverCard>
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-bg-secondary sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-accent-orange">
            오버워치 영웅 프리셋
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {ROLES.map((role) => (
            <RoleSection key={role} role={role} onSelect={onSelect} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
