import { PresetHeroCard } from "@/components/setting/preset-hero-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPresetsByRole, ROLE_LABELS } from "@/constants/presets";
import type { HeroPreset, HeroRole } from "@/types/preset";

interface PresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (hero: HeroPreset) => void;
}

const ROLES: HeroRole[] = ["tank", "damage", "support"];

export function PresetDialog({
  open,
  onOpenChange,
  onSelect,
}: PresetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] border-border bg-bg-secondary sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-accent-orange">
            오버워치 영웅 프리셋
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="tank">
          <TabsList className="w-full bg-bg-tertiary">
            {ROLES.map((role) => (
              <TabsTrigger
                key={role}
                value={role}
                className="flex-1 data-[state=active]:bg-bg-secondary data-[state=active]:text-accent-orange"
              >
                {ROLE_LABELS[role]} ({getPresetsByRole(role).length})
              </TabsTrigger>
            ))}
          </TabsList>
          {ROLES.map((role) => (
            <TabsContent key={role} value={role}>
              <ScrollArea className="h-[55vh]">
                <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3">
                  {getPresetsByRole(role).map((hero) => (
                    <PresetHeroCard
                      key={hero.id}
                      hero={hero}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
