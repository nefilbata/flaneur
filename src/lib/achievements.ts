import type { FoodRecord } from "@/types/food-record";

export interface AchievementDef {
  key: string;
  name: string;
  description: string;
  check: (records: FoodRecord[]) => boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    key: "first_record",
    name: "初探者",
    description: "第一次记录美食",
    check: (records) => records.length >= 1,
  },
  {
    key: "week_five_cuisines",
    name: "一周五味",
    description: "一周内记录 5 种不同菜系",
    check: (records) => hasCuisineVarietyInDays(records, 7, 5),
  },
  {
    key: "street_walk",
    name: "街头漫步",
    description: "吃遍同一条街上的 3 家店",
    check: (records) => hasThreeRestaurantsOnSameStreet(records),
  },
  {
    key: "map_conqueror",
    name: "地图征服者",
    description: "点亮 10 个区域",
    check: (records) => getDistinctAreas(records).size >= 10,
  },
  {
    key: "streak_7",
    name: "连续打卡 7 天",
    description: "连续 7 天有美食记录",
    check: (records) => hasDayStreak(records, 7),
  },
  {
    key: "streak_30",
    name: "连续打卡 30 天",
    description: "连续 30 天有美食记录",
    check: (records) => hasDayStreak(records, 30),
  },
  {
    key: "spicy_king",
    name: "辣王",
    description: "累计 20 条记录辣维度大于等于 4",
    check: (records) =>
      records.filter((record) => record.flavor.spicy >= 4).length >= 20,
  },
  {
    key: "sweet_hunter",
    name: "甜蜜控",
    description: "累计 20 条记录甜维度大于等于 4",
    check: (records) =>
      records.filter((record) => record.flavor.sweet >= 4).length >= 20,
  },
  {
    key: "hundred_records",
    name: "百食记",
    description: "总记录达到 100 条",
    check: (records) => records.length >= 100,
  },
  {
    key: "four_season_diner",
    name: "四季食客",
    description: "春夏秋冬各至少 5 条记录",
    check: (records) => {
      const seasons = { spring: 0, summer: 0, autumn: 0, winter: 0 };
      records.forEach((record) => {
        seasons[getSeason(record.recordDate)] += 1;
      });
      return Object.values(seasons).every((count) => count >= 5);
    },
  },
  {
    key: "late_night_canteen",
    name: "深夜食堂",
    description: "22:00 后记录 10 次",
    check: (records) =>
      records.filter((record) => getRecordHour(record) >= 22).length >= 10,
  },
  {
    key: "early_bird",
    name: "早起的鸟",
    description: "8:00 前记录 10 次",
    check: (records) =>
      records.filter((record) => getRecordHour(record) < 8).length >= 10,
  },
  {
    key: "old_gourmet",
    name: "老饕",
    description: "写过 20 条超过 100 字的品鉴笔记",
    check: (records) =>
      records.filter((record) => (record.tastingNotes?.trim().length ?? 0) > 100)
        .length >= 20,
  },
  {
    key: "restaurant_explorer",
    name: "探店达人",
    description: "累计去过 50 家不同餐厅",
    check: (records) =>
      new Set(records.map((record) => normalize(record.restaurantName))).size >= 50,
  },
  {
    key: "loyal_fan",
    name: "忠实粉丝",
    description: "同一家餐厅去过 5 次以上",
    check: (records) => maxCount(records.map((record) => record.restaurantName)) >= 5,
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

function hasCuisineVarietyInDays(
  records: FoodRecord[],
  days: number,
  targetCount: number
) {
  const sortedDates = uniqueSortedTimestamps(records);
  return sortedDates.some((start) => {
    const end = start + (days - 1) * dayMs();
    const cuisines = new Set<string>();
    records.forEach((record) => {
      const timestamp = toDayTimestamp(record.recordDate);
      if (timestamp >= start && timestamp <= end) {
        record.cuisineTags.forEach((tag) => cuisines.add(normalize(tag)));
      }
    });
    return cuisines.size >= targetCount;
  });
}

function hasDayStreak(records: FoodRecord[], targetDays: number) {
  const dates = new Set(records.map((record) => toDayTimestamp(record.recordDate)));
  return [...dates].some((start) =>
    Array.from({ length: targetDays }, (_, index) =>
      dates.has(start + index * dayMs())
    ).every(Boolean)
  );
}

function hasThreeRestaurantsOnSameStreet(records: FoodRecord[]) {
  const streetToRestaurants = new Map<string, Set<string>>();

  records.forEach((record) => {
    const street = extractStreet(record.restaurantAddress);
    if (!street) return;

    const restaurants = streetToRestaurants.get(street) ?? new Set<string>();
    restaurants.add(normalize(record.restaurantName));
    streetToRestaurants.set(street, restaurants);
  });

  return [...streetToRestaurants.values()].some((restaurants) => restaurants.size >= 3);
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

function uniqueSortedTimestamps(records: FoodRecord[]) {
  return [...new Set(records.map((record) => toDayTimestamp(record.recordDate)))].sort(
    (a, b) => a - b
  );
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

function maxCount(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const key = normalize(value);
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Math.max(0, ...counts.values());
}

function extractStreet(address?: string) {
  if (!address) return "";
  const match = address.match(/([\u4e00-\u9fa5A-Za-z0-9]+(?:路|街|巷|道|avenue|street|road|lane))/i);
  return normalize(match?.[1]);
}

function extractArea(address?: string) {
  if (!address) return "";
  const match = address.match(/([\u4e00-\u9fa5A-Za-z0-9]+(?:区|县|镇|商圈|CBD|area))/i);
  return normalize(match?.[1] ?? address.split(/[,\s，]/)[0]);
}
