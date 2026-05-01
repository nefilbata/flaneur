import { MapPin, Route, Store } from "lucide-react";
import { DEMO_RECORDS } from "@/lib/demo-records";
import type { FoodRecord } from "@/types/food-record";

const CITY_POINTS = [
  { x: 18, y: 62 },
  { x: 34, y: 45 },
  { x: 48, y: 68 },
  { x: 64, y: 38 },
  { x: 78, y: 56 },
  { x: 88, y: 31 },
];

export default function MapPage() {
  const restaurants = groupByRestaurant(DEMO_RECORDS);
  const areas = new Set(
    DEMO_RECORDS.map((record) => getArea(record.restaurantAddress)).filter(Boolean)
  );

  return (
    <section className="mx-auto max-w-3xl animate-fade-in-up pb-24">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">美食地图</h1>
        <p className="mt-2 text-sm text-muted">点亮你的城市味觉版图</p>
      </header>

      <div className="card overflow-hidden p-0">
        <div className="relative min-h-[280px] bg-[#f3eadc] p-5">
          <CityPreview visitedCount={areas.size} />
          <div className="absolute left-5 top-5 rounded-full bg-surface/90 px-3 py-1 text-xs text-muted shadow-sm">
            探索预览
          </div>
        </div>
        <div className="grid gap-3 border-t border-border p-5 sm:grid-cols-3">
          <Stat icon={Route} label="已探索区域" value={areas.size} suffix="处" />
          <Stat icon={Store} label="餐厅足迹" value={restaurants.length} suffix="家" />
          <Stat icon={MapPin} label="美食记录" value={DEMO_RECORDS.length} suffix="条" />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">探索足迹</h2>
            <p className="mt-1 text-sm text-muted">按餐厅汇总你的城市味道</p>
          </div>
          <span className="text-sm text-primary-strong">
            {areas.size} 个区域 / {restaurants.length} 家餐厅
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {restaurants.map((restaurant) => (
            <article key={restaurant.name} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl text-charcoal">{restaurant.name}</h3>
                  <p className="mt-1 text-xs text-muted">{restaurant.area}</p>
                </div>
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs text-primary-strong">
                  {restaurant.count} 次
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {restaurant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-soft px-2.5 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CityPreview({ visitedCount }: { visitedCount: number }) {
  return (
    <svg
      viewBox="0 0 420 260"
      className="h-full min-h-[260px] w-full"
      role="img"
      aria-label="城市探索预览"
    >
      <defs>
        <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fffaf3" />
          <stop offset="100%" stopColor="#e8d5c4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="420" height="260" rx="18" fill="url(#sky)" />
      <path
        d="M20 205 C78 178 126 197 180 166 C236 133 285 162 400 119"
        fill="none"
        stroke="#C4A882"
        strokeDasharray="8 8"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <g fill="#d9c8b4">
        <rect x="34" y="130" width="42" height="78" rx="4" />
        <rect x="88" y="104" width="56" height="104" rx="4" />
        <rect x="160" y="124" width="48" height="84" rx="4" />
        <rect x="224" y="84" width="62" height="124" rx="4" />
        <rect x="304" y="116" width="52" height="92" rx="4" />
      </g>
      <g fill="#8B7355" opacity="0.16">
        {Array.from({ length: 22 }, (_, index) => (
          <rect
            key={index}
            x={48 + (index % 9) * 34}
            y={136 + (index % 4) * 18}
            width="10"
            height="6"
            rx="1"
          />
        ))}
      </g>
      {CITY_POINTS.slice(0, Math.max(1, visitedCount)).map((point, index) => (
        <g
          key={`${point.x}-${point.y}`}
          transform={`translate(${(point.x / 100) * 420} ${(point.y / 100) * 260})`}
          filter="url(#glow)"
        >
          <circle r="10" fill="#D4B896" opacity="0.38" />
          <circle r="4.5" fill="#AD8581" />
          <text
            x="12"
            y="4"
            fill="#8B7355"
            fontSize="11"
            fontWeight="600"
          >
            {index + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof MapPin;
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-full bg-soft text-primary-strong">
        <Icon className="size-5" strokeWidth={1.5} />
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="font-serif text-2xl text-charcoal">
          {value}
          <span className="ml-1 font-sans text-sm text-muted">{suffix}</span>
        </p>
      </div>
    </div>
  );
}

function groupByRestaurant(records: FoodRecord[]) {
  const map = new Map<
    string,
    { name: string; area: string; count: number; tags: Set<string> }
  >();

  records.forEach((record) => {
    const current =
      map.get(record.restaurantName) ??
      {
        name: record.restaurantName,
        area: getArea(record.restaurantAddress) || "未知区域",
        count: 0,
        tags: new Set<string>(),
      };

    current.count += 1;
    record.cuisineTags.forEach((tag) => current.tags.add(tag));
    map.set(record.restaurantName, current);
  });

  return [...map.values()].map((item) => ({
    ...item,
    tags: [...item.tags],
  }));
}

function getArea(address?: string) {
  if (!address) return "";
  return address.split(/\s+/)[0] ?? "";
}
