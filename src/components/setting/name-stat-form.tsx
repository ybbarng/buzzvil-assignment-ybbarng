import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PresetDialog } from "@/components/setting/preset-dialog";
import { StatAllocator } from "@/components/setting/stat-allocator";
import { Input } from "@/components/ui/input";
import { TOTAL_POINTS } from "@/constants/stats";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import { cn } from "@/lib/utils";
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
      {/* 캐릭터 이름 */}
      <section className="border-l-2 border-accent-orange bg-bg-secondary/60 px-5 py-4">
        <h2 className="mb-3 text-sm font-bold tracking-wider text-accent-orange uppercase">
          캐릭터 이름
        </h2>
        <div className="flex gap-2">
          <div className={`flex-1 ${SKEW} bg-bg-tertiary px-4 py-2`}>
            <Input
              data-testid="name-input"
              placeholder="이름을 입력하세요 (1~10자)"
              maxLength={10}
              className="border-none bg-transparent text-text-primary shadow-none placeholder:text-text-muted"
              {...register("name")}
            />
          </div>
          <button
            type="button"
            onClick={() => setPresetOpen(true)}
            className={`${SKEW} cursor-pointer bg-accent-blue px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-all hover:scale-105 hover:brightness-125`}
          >
            <span className={`${SKEW_TEXT} block`}>프리셋</span>
          </button>
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-damage">{errors.name.message}</p>
        )}
      </section>
      <PresetDialog
        open={presetOpen}
        onOpenChange={setPresetOpen}
        onSelect={handlePresetSelect}
      />

      {/* 스탯 배분 */}
      <section className="border-l-2 border-accent-orange bg-bg-secondary/60 px-5 py-4">
        <h2 className="mb-3 text-sm font-bold tracking-wider text-accent-orange uppercase">
          스탯 배분
        </h2>
        <StatAllocator stats={stats} onChange={handleStatsChange} />
        {errors.stats?.root && (
          <p className="mt-2 text-sm text-damage">
            {errors.stats.root.message}
          </p>
        )}
      </section>

      <button
        type="submit"
        data-testid="next-button"
        disabled={!isComplete}
        className={cn(
          `${SKEW} w-full cursor-pointer px-8 py-2.5 text-sm font-bold text-white uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-40`,
          isComplete
            ? "animate-button-ready bg-accent-orange hover:bg-accent-orange-hover"
            : "bg-accent-orange",
        )}
      >
        <span className={`${SKEW_TEXT} block`}>다음</span>
      </button>
    </form>
  );
}
