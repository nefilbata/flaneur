"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Award, Sparkles, X } from "lucide-react";
import { ScratchCard } from "@/components/scratch-card/scratch-card";
import { ACHIEVEMENT_DEFS, checkAchievements, type AchievementDef } from "@/lib/achievements";
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
  const progress = Math.round((unlockedCount / ACHIEVEMENT_DEFS.length) * 100);

  const markScratched = (key: string) => {
    setStates((current) =>
      current.map((item) =>
        item.key === key ? { ...item, isScratched: true } : item
      )
    );
    window.setTimeout(() => setActiveKey(null), 900);
  };

  return (
    <section className="mx-auto max-w-6xl animate-fade-in-up pb-20 md:pb-12">
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <header className="rounded-[28px] border border-border bg-surface px-5 py-6 shadow-[0_16px_46px_rgba(44,44,44,0.07)] sm:px-7 sm:py-8">
          <p className="text-xs uppercase tracking-[0.26em] text-muted">
            Achievement hall
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
                成就殿堂
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                每一枚勋章都来自一次真实的探索，不需要喧哗，慢慢点亮就好。
              </p>
            </div>
            <div className="w-full rounded-2xl bg-background p-4 sm:w-44">
              <p className="text-xs text-muted">已解锁</p>
              <p className="mt-1 font-serif text-3xl text-primary-strong">
                {unlockedCount}
                <span className="ml-1 font-sans text-sm text-muted">
                  / {ACHIEVEMENT_DEFS.length}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-soft">
            <div
              className="h-full rounded-full bg-primary-strong transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <button
          type="button"
          onClick={() => pending[0] && setActiveKey(pending[0].key)}
          disabled={pending.length === 0}
          className="rounded-[28px] border border-primary/30 bg-[#f6ead7] px-5 py-6 text-left shadow-[0_16px_46px_rgba(173,133,129,0.12)] transition hover:-translate-y-0.5 disabled:border-border disabled:bg-surface disabled:shadow-none"
        >
          <span className="grid size-11 place-items-center rounded-full bg-surface text-primary-strong">
            <Sparkles className="size-5" />
          </span>
          <span className="mt-5 block font-serif text-2xl text-charcoal">
            {pending.length > 0 ? "有新徽章待揭开" : "暂无待刮徽章"}
          </span>
          <span className="mt-2 block text-sm leading-6 text-muted">
            {pending.length > 0
              ? `${pending.length} 张成就卡已经准备好，点开后会直接出现在当前屏幕。`
              : "继续记录，新的探索会在这里安静出现。"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                "group min-h-[156px] rounded-[22px] border px-3 py-4 text-center transition sm:min-h-[172px]",
                isPending
                  ? "border-primary/40 bg-[#f6ead7] shadow-[0_12px_30px_rgba(173,133,129,0.13)] hover:-translate-y-0.5"
                  : isUnlocked
                    ? "border-border bg-surface shadow-[0_8px_26px_rgba(44,44,44,0.06)]"
                    : "border-border bg-soft/55 text-muted",
              ].join(" ")}
            >
              <span
                className={[
                  "mx-auto grid size-14 place-items-center rounded-full text-3xl transition sm:size-16",
                  isUnlocked
                    ? "bg-background"
                    : "bg-background/60 grayscale opacity-60",
                ].join(" ")}
              >
                {isUnlocked ? achievement.emoji : "?"}
              </span>
              <span
                className={[
                  "mt-3 block text-sm font-semibold leading-5",
                  isUnlocked ? "text-charcoal" : "text-muted",
                ].join(" ")}
              >
                {isUnlocked ? achievement.name : "未解锁"}
              </span>
              <span className="mt-1.5 block text-[11px] leading-4 text-muted">
                {isUnlocked ? achievement.description : achievement.condition}
              </span>
              {isPending && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-primary-strong">
                  <Award className="size-3" />
                  刮开
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AchievementScratchModal
        achievement={activeAchievement}
        onClose={() => setActiveKey(null)}
        onReveal={markScratched}
      />
    </section>
  );
}

function AchievementScratchModal({
  achievement,
  onClose,
  onReveal,
}: {
  achievement?: AchievementDef;
  onClose: () => void;
  onReveal: (key: string) => void;
}) {
  useEffect(() => {
    if (!achievement) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [achievement]);

  if (!achievement || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-charcoal/45 px-5 py-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm">
      <div className="relative max-h-[calc(100dvh-2rem)] w-[min(320px,88vw)] overflow-y-auto rounded-[24px] border border-border bg-surface p-4 shadow-[0_24px_80px_rgba(44,44,44,0.24)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-soft text-muted transition hover:bg-border"
          aria-label="关闭刮卡"
        >
          <X className="size-4" />
        </button>
        <p className="text-center text-[11px] uppercase tracking-[0.24em] text-muted">
          Scratch card
        </p>
        <h2 className="mb-3 mt-1 text-center font-serif text-2xl text-charcoal">
          刮开新成就
        </h2>
        <div className="flex justify-center">
          <ScratchCard
            width={240}
            height={168}
            revealThreshold={0.5}
            onReveal={() => onReveal(achievement.key)}
          >
            <div className="grid size-full place-items-center bg-background p-4 text-center">
              <div>
                <div className="text-4xl">{achievement.emoji}</div>
                <h3 className="mt-2 font-serif text-lg text-charcoal">
                  {achievement.name}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  {achievement.description}
                </p>
              </div>
            </div>
          </ScratchCard>
        </div>
      </div>
    </div>,
    document.body
  );
}
