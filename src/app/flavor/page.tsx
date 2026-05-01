"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { DEMO_RECORDS } from "@/lib/demo-records";
import { FLAVOR_TITLES, type FlavorProfile, type FoodRecord } from "@/types/food-record";

const FLAVOR_AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: "umami", label: "\u9c9c" },
  { key: "spicy", label: "\u8fa3" },
  { key: "sweet", label: "\u751c" },
  { key: "aromatic", label: "\u9999" },
  { key: "sour", label: "\u9178" },
  { key: "rich", label: "\u6d53" },
];

export default function FlavorPage() {
  const records = DEMO_RECORDS;
  const averages = getFlavorAverages(records);
  const title =
    FLAVOR_TITLES.find((item) => item.condition(averages))?.name ??
    "\u5168\u80fd\u5473\u857e";
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
        <p className="mt-2 text-sm text-muted">
          {"\u4f60\u7684\u5473\u89c9\u4eba\u683c\u753b\u50cf"}
        </p>
      </header>

      <div className="card h-80 overflow-hidden p-4">
        {records.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={data} outerRadius="72%">
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
          </ResponsiveContainer>
        ) : (
          <div className="grid size-full place-items-center text-center">
            <div className="relative size-48">
              <div className="absolute inset-0 clip-hexagon border border-dashed border-muted/40" />
              <div className="absolute inset-6 clip-hexagon border border-dashed border-muted/30" />
              <div className="absolute inset-12 clip-hexagon border border-dashed border-muted/20" />
              <p className="absolute inset-x-0 bottom-0 text-sm text-muted">
                {"\u8bb0\u5f55\u66f4\u591a\u7f8e\u98df\uff0c\u89e3\u9501\u4f60\u7684\u5473\u89c9\u4eba\u683c"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatCard label={"\u603b\u8bb0\u5f55"} value={`${records.length} \u6761`} />
        <StatCard label={"\u6d89\u53ca\u83dc\u7cfb"} value={`${stats.cuisineCount} \u79cd`} />
        <StatCard label={"\u5e38\u53bb\u9910\u5385"} value={stats.favoriteRestaurant} />
        <StatCard label={"\u6700\u9ad8\u8bc4\u5206"} value={stats.topDish} />
        <div className="card col-span-2 p-5 text-center">
          <p className="text-sm text-muted">{"\u5e73\u5747\u6d88\u8d39"}</p>
          <p className="mt-1 font-serif text-3xl text-charcoal">
            {stats.averageCost ? `\u00a5${stats.averageCost}` : "\u6682\u65e0"}
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
    getMostFrequent(records.map((record) => record.restaurantName)) ?? "\u6682\u65e0";
  const topDish =
    [...records].sort(
      (a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0)
    )[0]?.dishName ?? "\u6682\u65e0";
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
