"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { DEMO_RECORDS } from "@/lib/demo-records";
import type { FoodRecord } from "@/types/food-record";

const SEASON_THEMES = {
  spring: {
    label: "春",
    emoji: "🌸",
    bg: "from-pink-50 to-rose-50",
    accent: "#E8A0BF",
    months: [3, 4, 5],
  },
  summer: {
    label: "夏",
    emoji: "🌿",
    bg: "from-emerald-50 to-cyan-50",
    accent: "#7EC8B8",
    months: [6, 7, 8],
  },
  autumn: {
    label: "秋",
    emoji: "🍁",
    bg: "from-amber-50 to-orange-50",
    accent: "#D4915D",
    months: [9, 10, 11],
  },
  winter: {
    label: "冬",
    emoji: "❄️",
    bg: "from-slate-50 to-blue-50",
    accent: "#8BA4C4",
    months: [12, 1, 2],
  },
};

type SeasonKey = keyof typeof SEASON_THEMES;

function getSeasonByMonth(month: number): SeasonKey {
  return (
    (Object.entries(SEASON_THEMES).find(([, theme]) =>
      theme.months.includes(month)
    )?.[0] as SeasonKey) ?? "spring"
  );
}

export default function SeasonsPage() {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(
    getSeasonByMonth(new Date().getMonth() + 1)
  );
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const activeTheme = SEASON_THEMES[activeSeason];

  const records = useMemo(
    () =>
      DEMO_RECORDS.filter((record) =>
        activeTheme.months.includes(Number(record.recordDate.slice(5, 7)))
      ),
    [activeTheme.months]
  );

  return (
    <section
      className={`mx-auto max-w-lg rounded-[28px] bg-gradient-to-br ${activeTheme.bg} p-4 pb-24 transition-colors duration-500`}
    >
      <header className="mb-6 text-center">
        <h1 className="font-serif text-4xl text-charcoal">季节卷轴</h1>
        <p className="mt-2 text-sm text-muted">四季流转，美味不息</p>
      </header>

      <div className="mb-5 grid grid-cols-4 gap-2">
        {(Object.keys(SEASON_THEMES) as SeasonKey[]).map((season) => {
          const theme = SEASON_THEMES[season];
          const isActive = season === activeSeason;
          return (
            <button
              key={season}
              type="button"
              onClick={() => setActiveSeason(season)}
              className={[
                "rounded-2xl px-3 py-3 text-center transition",
                isActive ? "bg-surface shadow-card" : "bg-white/45 hover:bg-white/70",
              ].join(" ")}
              style={{ color: isActive ? theme.accent : undefined }}
            >
              <span className="block text-xl">{theme.emoji}</span>
              <span className="mt-1 block font-serif text-lg">{theme.label}</span>
            </button>
          );
        })}
      </div>

      {records.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-6xl">{activeTheme.emoji}</div>
          <h2 className="mt-4 font-serif text-2xl text-charcoal">
            这个季节还没有美食记录
          </h2>
          <p className="mt-3 text-sm text-muted">下一次品尝，会成为这里的第一张卡片。</p>
        </div>
      ) : (
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3">
          {records.map((record) => (
            <SeasonRecordCard
              key={record.id}
              record={record}
              accent={activeTheme.accent}
              isExpanded={expandedRecordId === record.id}
              onToggle={() =>
                setExpandedRecordId((current) =>
                  current === record.id ? null : record.id
                )
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SeasonRecordCard({
  record,
  accent,
  isExpanded,
  onToggle,
}: {
  record: FoodRecord;
  accent: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cover = record.photos[0];

  return (
    <button
      type="button"
      onClick={onToggle}
      className="card w-72 shrink-0 snap-center overflow-hidden p-0 text-left"
    >
      <div className="relative h-44 w-full bg-soft">
        {cover && (
          <Image
            src={cover.url}
            alt={record.dishName}
            fill
            sizes="288px"
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted">{record.recordDate}</p>
        <h2 className="mt-1 font-serif text-2xl text-charcoal">{record.dishName}</h2>
        <p className="mt-1 text-sm text-muted">{record.restaurantName}</p>
        <div className="mt-3 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={`size-4 ${
                index < (record.overallRating ?? 0)
                  ? "fill-warning text-warning"
                  : "text-border"
              }`}
            />
          ))}
        </div>
        {isExpanded && (
          <p className="mt-4 rounded-2xl bg-background p-3 text-sm leading-6 text-muted">
            {record.tastingNotes || "这次还没有写下品鉴笔记。"}
          </p>
        )}
        <div className="mt-4 h-1 rounded-full" style={{ background: accent }} />
      </div>
    </button>
  );
}
