"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { ScratchCard } from "@/components/scratch-card/scratch-card";
import { ACHIEVEMENT_DEFS, checkAchievements } from "@/lib/achievements";
import { DEMO_RECORDS } from "@/lib/demo-records";

type AchievementState = {
  key: string;
  unlockedAt: string;
  isScratched: boolean;
};

const initialUnlocked: AchievementState[] = [
  { key: "first_bite", unlockedAt: "2026-04-03", isScratched: true },
  { key: "street_walker", unlockedAt: "2026-04-25", isScratched: false },
];

export default function AchievementsPage() {
  const newlyUnlocked = useMemo(
    () => checkAchievements(DEMO_RECORDS, initialUnlocked.map((item) => item.key)),
    []
  );
  const [states, setStates] = useState<AchievementState[]>([
    ...initialUnlocked,
    ...newlyUnlocked.map((achievement) => ({
      key: achievement.key,
      unlockedAt: new Date().toISOString().slice(0, 10),
      isScratched: false,
    })),
  ]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const unlockedCount = states.length;
  const pending = states.filter((state) => !state.isScratched);
  const activeAchievement = ACHIEVEMENT_DEFS.find(
    (achievement) => achievement.key === activeKey
  );

  const markScratched = (key: string) => {
    setStates((current) =>
      current.map((item) =>
        item.key === key ? { ...item, isScratched: true } : item
      )
    );
    window.setTimeout(() => setActiveKey(null), 900);
  };

  return (
    <section className="mx-auto max-w-3xl animate-fade-in-up pb-20 sm:pb-24">
      <header className="mb-5 text-center sm:mb-8">
        <h1 className="font-serif text-3xl text-charcoal sm:text-4xl md:text-5xl">
          成就殿堂
        </h1>
        <p className="mt-1.5 text-xs text-muted sm:mt-2 sm:text-sm">
          每一次品尝，都是一枚勋章
        </p>
        <p className="mt-3 font-serif text-xl text-primary-strong sm:mt-4 sm:text-2xl">
          已解锁 {unlockedCount} / {ACHIEVEMENT_DEFS.length}
        </p>
      </header>

      {pending.length > 0 && (
        <button
          type="button"
          onClick={() => setActiveKey(pending[0].key)}
          className="card mb-4 w-full p-4 text-left ring-2 ring-primary/30 sm:mb-5 sm:p-5"
        >
          <p className="text-xs text-muted sm:text-sm">新的惊喜</p>
          <p className="mt-1 font-serif text-xl text-charcoal sm:text-2xl">
            你有 {pending.length} 张待刮的成就卡
          </p>
          <p className="mt-2 text-xs text-primary-strong sm:text-sm">
            点击前往刮卡
          </p>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENT_DEFS.map((achievement) => {
          const state = states.find((item) => item.key === achievement.key);
          const isUnlocked = Boolean(state);
          const isPending = isUnlocked && !state?.isScratched;

          return (
            <button
              key={achievement.key}
              type="button"
              onClick={() => isPending && setActiveKey(achievement.key)}
              disabled={!isPending}
              className={[
                "flex aspect-square min-h-[148px] flex-col items-center justify-center overflow-hidden rounded-card border p-3 text-center transition sm:min-h-[190px] sm:p-4",
                isPending
                  ? "border-warning/50 bg-[#f5dfaa] shadow-card hover:-translate-y-0.5"
                  : isUnlocked
                    ? "border-primary/40 bg-surface shadow-card"
                    : "border-border bg-soft/70 text-muted",
              ].join(" ")}
            >
              <span className="block text-3xl leading-none sm:text-4xl">
                {isUnlocked ? achievement.emoji : "?"}
              </span>
              <span
                className={[
                  "mt-2 block text-xs font-semibold leading-5 sm:mt-3 sm:text-sm",
                  isUnlocked ? "text-charcoal" : "text-muted blur-[2px]",
                ].join(" ")}
              >
                {achievement.name}
              </span>
              <span className="mt-1.5 block text-[11px] leading-4 text-muted sm:mt-2 sm:text-xs sm:leading-5">
                {isUnlocked ? achievement.description : achievement.condition}
              </span>
              {state?.isScratched && (
                <span className="mt-2 block text-[10px] text-muted sm:mt-3 sm:text-[11px]">
                  {state.unlockedAt}
                </span>
              )}
              {isPending && (
                <span className="mt-2 block text-[11px] font-medium text-primary-strong sm:mt-3 sm:text-xs">
                  点击刮卡
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeAchievement && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-charcoal/40 p-5 backdrop-blur-sm">
          <div className="relative w-full max-w-[calc(100vw-40px)] rounded-card bg-surface p-4 shadow-card-hover sm:max-w-sm sm:p-5">
            <button
              type="button"
              onClick={() => setActiveKey(null)}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-soft text-muted transition hover:bg-border sm:size-10"
              aria-label="关闭刮卡"
            >
              <X className="size-4" />
            </button>
            <h2 className="mb-3 text-center font-serif text-xl text-charcoal sm:mb-4 sm:text-2xl">
              刮开新成就
            </h2>
            <div className="flex justify-center">
              <ScratchCard
                width={280}
                height={196}
                revealThreshold={0.5}
                onReveal={() => markScratched(activeAchievement.key)}
              >
                <div className="grid size-full place-items-center bg-background p-5 text-center sm:p-6">
                  <div>
                    <div className="text-5xl sm:text-6xl">
                      {activeAchievement.emoji}
                    </div>
                    <h3 className="mt-2 font-serif text-xl text-charcoal sm:mt-3 sm:text-2xl">
                      {activeAchievement.name}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-muted sm:text-sm sm:leading-6">
                      {activeAchievement.description}
                    </p>
                  </div>
                </div>
              </ScratchCard>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
