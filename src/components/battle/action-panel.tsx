import { Button } from "@/components/ui/button";
import type { BattleCharacter } from "@/types/battle";

interface ActionPanelProps {
  player: BattleCharacter;
  onAction: (skillIndex: number) => void;
  disabled: boolean;
}

export function ActionPanel({ player, onAction, disabled }: ActionPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {player.skills.map((skill, index) => {
        const canUse = skill.mpCost <= player.currentMp;
        return (
          <Button
            key={skill.name}
            type="button"
            data-testid={`skill-button-${index}`}
            disabled={disabled || !canUse}
            className="h-auto flex-col gap-0.5 bg-bg-secondary py-2 text-text-primary hover:bg-bg-tertiary disabled:opacity-40"
            variant="outline"
            onClick={() => onAction(index)}
          >
            <span className="font-semibold">{skill.name}</span>
            {skill.mpCost > 0 && (
              <span className="text-xs text-mp">MP {skill.mpCost}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
