import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PresetDialog } from "@/components/setting/preset-dialog";
import { StatAllocator } from "@/components/setting/stat-allocator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TOTAL_POINTS } from "@/constants/stats";
import {
  type NameStatFormData,
  nameStatSchema,
} from "@/schemas/name-stat.schema";
import type { Stats } from "@/types/character";
import type { HeroPreset } from "@/types/preset";

interface NameStatFormProps {
  defaultName: string;
  defaultStats: Stats;
  onSubmit: (data: NameStatFormData) => void;
}

export function NameStatForm({
  defaultName,
  defaultStats,
  onSubmit,
}: NameStatFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NameStatFormData>({
    resolver: zodResolver(nameStatSchema),
    defaultValues: {
      name: defaultName,
      stats: defaultStats,
    },
  });

  const [presetOpen, setPresetOpen] = useState(false);

  const stats = watch("stats");
  const totalUsed = Object.values(stats).reduce((a, b) => a + b, 0);
  const isComplete = totalUsed === TOTAL_POINTS;

  const handleStatsChange = (newStats: Stats) => {
    setValue("stats", newStats, { shouldValidate: true });
  };

  const handlePresetSelect = (hero: HeroPreset) => {
    setValue("name", hero.name, { shouldValidate: true });
    setValue("stats", hero.stats, { shouldValidate: true });
    setPresetOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-border bg-bg-secondary">
        <CardHeader>
          <CardTitle className="text-accent-orange">캐릭터 이름</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            data-testid="name-input"
            placeholder="이름을 입력하세요 (1~10자)"
            maxLength={10}
            className="border-border bg-bg-tertiary text-text-primary placeholder:text-text-muted"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-damage">{errors.name.message}</p>
          )}
        </CardContent>
      </Card>

      <Button
        type="button"
        variant="outline"
        onClick={() => setPresetOpen(true)}
        className="w-full border-accent-blue text-accent-blue hover:bg-accent-blue/10"
      >
        프리셋 불러오기
      </Button>
      <PresetDialog
        open={presetOpen}
        onOpenChange={setPresetOpen}
        onSelect={handlePresetSelect}
      />

      <Card className="border-border bg-bg-secondary">
        <CardHeader>
          <CardTitle className="text-accent-orange">스탯 배분</CardTitle>
        </CardHeader>
        <CardContent>
          <StatAllocator stats={stats} onChange={handleStatsChange} />
          {errors.stats?.root && (
            <p className="mt-2 text-sm text-damage">
              {errors.stats.root.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        type="submit"
        data-testid="next-button"
        disabled={!isComplete}
        className="w-full bg-accent-orange font-bold text-bg-primary hover:bg-accent-orange-hover disabled:opacity-50"
      >
        다음
      </Button>
    </form>
  );
}
