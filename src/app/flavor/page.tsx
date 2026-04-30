"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import { DEMO_RECORDS } from "@/lib/demo-records";
import { FLAVOR_TITLES, type FlavorProfile, type FoodRecord } from "@/types/food-record";

const FLAVOR_AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: "umami", label: "鲜" },
  { key: "spicy", label: "辣" },
  { key: "sweet", label: "甜" },
  { key: "aromatic", label: "香" },
  { key: "sour", label: "酸" },
  { key: "rich", label: "浓" },
];

export default function FlavorPage() {
  const records = DEMO_RECORDS;
  const averages = getFlavorAverages(records);
  const title =
    FLAVOR_TITLES.find((item) => item.condition(averages))?.name ??
    "全能味蕾 · 杂食行者";
  const data = FLAVOR_AXES.map((axis) => ({
    axis: axis.label,
    value: Number(averages[axis.key].toFixed(2)),
  }));
  const stats = getStats(records);

  return (
    <section className="mx-auto max-w-lg animate-fade-in-up pb-24">
      <header className="mb-8 text-center">
        <p className="text-sm uppercase tracking-widest text-muted">Flavor Archive</p>
        <h1 className="mt-2 font-serif text-4xl text-charcoal">{title}</h1>
        <p className="mt-2 text-sm text-muted">你的味觉人格画像</p>
      </header>

      <div className="card h-80 overflow-hidden p-4">
        {records.length > 0 ? (
          <div className="flex size-full justify-center">
            <RadarChart width={360} height={290} data={data} outerRadius="72%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: "var(--color-muted)", fontSize: 13 }}
              />
              <Radar
                dataKey="value"
                stroke="var(--color-primary-strong)"
                fill="var(--color-primary)"
                fillOpacity={0.35}
                strokeWidth={2}
                isAnimationActive
              />
            </RadarChart>
          </div>
        ) : (
          <div className="grid size-full place-items-center text-center">
            <div className="relative size-48">
              <div className="absolute inset-0 clip-hexagon border border-dashed border-muted/40" />
              <div className="absolute inset-6 clip-hexagon border border-dashed border-muted/30" />
              <div className="absolute inset-12 clip-hexagon border border-dashed border-muted/20" />
              <p className="absolute inset-x-0 bottom-0 text-sm text-muted">
                记录更多美食，解锁你的味觉人格
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatCard label="总记录" value={`${records.length} 条`} />
        <StatCard label="涉及菜系" value={`${stats.cuisineCount} 种`} />
        <StatCard label="常去餐厅" value={stats.favoriteRestaurant} />
        <StatCard label="最高评分" value={stats.topDish} />
        <div className="card col-span-2 p-5 text-center">
          <p className="text-sm text-muted">平均消费</p>
          <p className="mt-1 font-serif text-3xl text-charcoal">
            {stats.averageCost ? `¥${stats.averageCost}` : "暂无"}
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5 text-center">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 line-clamp-2 font-serif text-2xl text-charcoal">{value}</p>
    </div>
  );
}

function getFlavorAverages(records: FoodRecord[]): FlavorProfile {
  if (records.length === 0) {
    return { umami: 0, spicy: 0, sweet: 0, aromatic: 0, sour: 0, rich: 0 };
  }

  const totals = records.reduce<FlavorProfile>(
    (sum, record) => ({
      umami: sum.umami + record.flavor.umami,
      spicy: sum.spicy + record.flavor.spicy,
      sweet: sum.sweet + record.flavor.sweet,
      aromatic: sum.aromatic + record.flavor.aromatic,
      sour: sum.sour + record.flavor.sour,
      rich: sum.rich + record.flavor.rich,
    }),
    { umami: 0, spicy: 0, sweet: 0, aromatic: 0, sour: 0, rich: 0 }
  );

  return {
    umami: totals.umami / records.length,
    spicy: totals.spicy / records.length,
    sweet: totals.sweet / records.length,
    aromatic: totals.aromatic / records.length,
    sour: totals.sour / records.length,
    rich: totals.rich / records.length,
  };
}

function getStats(records: FoodRecord[]) {
  const cuisines = new Set(records.flatMap((record) => record.cuisineTags));
  const favoriteRestaurant =
    getMostFrequent(records.map((record) => record.restaurantName)) ?? "暂无";
  const topDish =
    [...records].sort(
      (a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0)
    )[0]?.dishName ?? "暂无";
  const costs = records
    .map((record) => record.costPerPerson)
    .filter((cost): cost is number => typeof cost === "number");
  const averageCost =
    costs.length > 0
      ? Math.round(costs.reduce((sum, cost) => sum + cost, 0) / costs.length)
      : 0;

  return {
    cuisineCount: cuisines.size,
    favoriteRestaurant,
    topDish,
    averageCost,
  };
}

function getMostFrequent(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}
