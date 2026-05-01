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
    <section className="mx-auto max-w-3xl animate-fade-in-up pb-24">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">成就殿堂</h1>
        <p className="mt-2 text-sm text-muted">每一次品尝，都是一枚勋章</p>
        <p className="mt-4 font-serif text-2xl text-primary-strong">
          已解锁 {unlockedCount} / {ACHIEVEMENT_DEFS.length}
        </p>
      </header>

      {pending.length > 0 && (
        <button
          type="button"
          onClick={() => setActiveKey(pending[0].key)}
          className="card mb-5 w-full p-5 text-left ring-2 ring-primary/30"
        >
          <p className="text-sm text-muted">新的惊喜</p>
          <p className="mt-1 font-serif text-2xl text-charcoal">
            你有 {pending.length} 张待刮的成就卡
          </p>
          <p className="mt-2 text-sm text-primary-strong">点击前往刮卡</p>
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
                "min-h-[180px] rounded-card border p-4 text-center transition sm:min-h-[200px]",
                isPending
                  ? "border-warning/50 bg-[#f5dfaa] shadow-card hover:-translate-y-0.5"
                  : isUnlocked
                    ? "border-primary/40 bg-surface shadow-card"
                    : "border-border bg-soft/70 text-muted",
              ].join(" ")}
            >
              <span className="block text-4xl">
                {isUnlocked ? achievement.emoji : "?"}
              </span>
              <span
                className={[
                  "mt-3 block text-sm font-semibold",
                  isUnlocked ? "text-charcoal" : "text-muted blur-[2px]",
                ].join(" ")}
              >
                {achievement.name}
              </span>
              <span className="mt-2 block text-xs leading-5 text-muted">
                {isUnlocked ? achievement.description : achievement.condition}
              </span>
              {state?.isScratched && (
                <span className="mt-3 block text-[11px] text-muted">
                  {state.unlockedAt}
                </span>
              )}
              {isPending && (
                <span className="mt-3 block text-xs font-medium text-primary-strong">
                  点击刮卡
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeAchievement && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-charcoal/40 p-5 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-card bg-surface p-5 shadow-card-hover">
            <button
              type="button"
              onClick={() => setActiveKey(null)}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-soft text-muted transition hover:bg-border"
              aria-label="关闭刮卡"
            >
              <X className="size-4" />
            </button>
            <h2 className="mb-4 text-center font-serif text-2xl text-charcoal">
              刮开新成就
            </h2>
            <div className="flex justify-center">
              <ScratchCard
                width={300}
                height={220}
                revealThreshold={0.5}
                onReveal={() => markScratched(activeAchievement.key)}
              >
                <div className="grid size-full place-items-center bg-background p-6 text-center">
                  <div>
                    <div className="text-6xl">{activeAchievement.emoji}</div>
                    <h3 className="mt-3 font-serif text-2xl text-charcoal">
                      {activeAchievement.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
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
