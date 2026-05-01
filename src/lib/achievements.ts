import type { FoodRecord } from "@/types/food-record";

export interface AchievementDef {
  key: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
  check: (records: FoodRecord[]) => boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    key: "first_bite",
    name: "初探者",
    emoji: "🥢",
    condition: "第一次记录美食",
    description: "第一枚味觉坐标已经落下。",
    check: (records) => records.length >= 1,
  },
  {
    key: "five_cuisines",
    name: "一周五味",
    emoji: "🎨",
    condition: "记录 5 种不同菜系",
    description: "味蕾开始有了自己的调色盘。",
    check: (records) => getCuisineCount(records) >= 5,
  },
  {
    key: "street_walker",
    name: "街头漫步",
    emoji: "🚶",
    condition: "探索 5 个不同区域",
    description: "把城市慢慢吃成一张地图。",
    check: (records) => getDistinctAreas(records).size >= 5,
  },
  {
    key: "map_explorer",
    name: "地图征服者",
    emoji: "🗺️",
    condition: "探索 10 个不同区域",
    description: "你开始拥有自己的美食地理学。",
    check: (records) => getDistinctAreas(records).size >= 10,
  },
  {
    key: "streak_7",
    name: "连续打卡 7 天",
    emoji: "🔥",
    condition: "连续 7 天有记录",
    description: "日历上亮起了一小串火光。",
    check: (records) => hasDayStreak(records, 7),
  },
  {
    key: "streak_30",
    name: "连续打卡 30 天",
    emoji: "🏅",
    condition: "连续 30 天有记录",
    description: "真正的美食修行者。",
    check: (records) => hasDayStreak(records, 30),
  },
  {
    key: "gourmet",
    name: "美食家",
    emoji: "👩‍🍳",
    condition: "累计 50 条记录",
    description: "半百美味，已经很有分量。",
    check: (records) => records.length >= 50,
  },
  {
    key: "connoisseur",
    name: "鉴赏家",
    emoji: "🎖️",
    condition: "10 条记录评分不低于 4.5",
    description: "你知道什么值得反复回味。",
    check: (records) =>
      records.filter((record) => (record.overallRating ?? 0) >= 4.5).length >= 10,
  },
  {
    key: "explorer",
    name: "百食记",
    emoji: "📍",
    condition: "探访 100 家不同餐厅",
    description: "吃遍百家，路标都变成菜单。",
    check: (records) =>
      new Set(records.map((record) => normalize(record.restaurantName))).size >= 100,
  },
  {
    key: "spicy_lover",
    name: "辣味狂热",
    emoji: "🌶️",
    condition: "5 条记录辣度评分为 5",
    description: "无辣不欢，火力全开。",
    check: (records) => records.filter((record) => record.flavor.spicy === 5).length >= 5,
  },
  {
    key: "sweet_tooth",
    name: "甜蜜派",
    emoji: "🍰",
    condition: "5 条记录甜度评分为 5",
    description: "甜味是你的温柔标点。",
    check: (records) => records.filter((record) => record.flavor.sweet === 5).length >= 5,
  },
  {
    key: "umami_master",
    name: "鲜味大师",
    emoji: "🍜",
    condition: "5 条记录鲜味评分为 5",
    description: "追鲜达人，汤底也有层次。",
    check: (records) => records.filter((record) => record.flavor.umami === 5).length >= 5,
  },
  {
    key: "night_owl",
    name: "深夜食堂",
    emoji: "🌙",
    condition: "3 条记录在 22:00 后",
    description: "夜色里的那一口最会安慰人。",
    check: (records) => records.filter((record) => getRecordHour(record) >= 22).length >= 3,
  },
  {
    key: "early_bird",
    name: "早起觅食",
    emoji: "🥐",
    condition: "3 条记录在 8:00 前",
    description: "清晨的城市先被你尝到。",
    check: (records) => records.filter((record) => getRecordHour(record) < 8).length >= 3,
  },
  {
    key: "all_seasons",
    name: "四季食客",
    emoji: "🍂",
    condition: "春夏秋冬各至少 1 条",
    description: "四季流转，味道不停。",
    check: (records) => {
      const seasons = { spring: 0, summer: 0, autumn: 0, winter: 0 };
      records.forEach((record) => {
        seasons[getSeason(record.recordDate)] += 1;
      });
      return Object.values(seasons).every((count) => count >= 1);
    },
  },
];

export function checkAchievements(
  records: FoodRecord[],
  existingAchievements: string[]
): AchievementDef[] {
  const existing = new Set(existingAchievements);
  return ACHIEVEMENT_DEFS.filter(
    (achievement) => !existing.has(achievement.key) && achievement.check(records)
  );
}

function getCuisineCount(records: FoodRecord[]) {
  const cuisines = new Set<string>();
  records.forEach((record) =>
    record.cuisineTags.forEach((tag) => cuisines.add(normalize(tag)))
  );
  return cuisines.size;
}

function hasDayStreak(records: FoodRecord[], targetDays: number) {
  const dates = new Set(records.map((record) => toDayTimestamp(record.recordDate)));
  return [...dates].some((start) =>
    Array.from({ length: targetDays }, (_, index) =>
      dates.has(start + index * dayMs())
    ).every(Boolean)
  );
}

function getDistinctAreas(records: FoodRecord[]) {
  const areas = new Set<string>();

  records.forEach((record) => {
    const area = extractArea(record.restaurantAddress);
    if (area) {
      areas.add(area);
    } else if (record.latitude != null && record.longitude != null) {
      areas.add(`${record.latitude.toFixed(2)},${record.longitude.toFixed(2)}`);
    } else {
      areas.add(normalize(record.restaurantName));
    }
  });

  return areas;
}

function getSeason(date: string): "spring" | "summer" | "autumn" | "winter" {
  const month = Number(date.slice(5, 7));
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function getRecordHour(record: FoodRecord) {
  const date = new Date(record.createdAt);
  return Number.isNaN(date.getTime()) ? 12 : date.getHours();
}

function toDayTimestamp(date: string) {
  return new Date(`${date}T00:00:00`).getTime();
}

function dayMs() {
  return 24 * 60 * 60 * 1000;
}

function normalize(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function extractArea(address?: string) {
  if (!address) return "";
  const match = address.match(/([\u4e00-\u9fa5A-Za-z0-9]+(?:路|街|巷|区|道|商圈|CBD|area))/i);
  return normalize(match?.[1] ?? address.split(/[,\s，、]/)[0]);
}
