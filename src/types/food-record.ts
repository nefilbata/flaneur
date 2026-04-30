/* ══════════════════════════════════════
   Flâneur — Type Definitions
   ══════════════════════════════════════ */

export interface FlavorProfile {
  umami: number;   // 鲜 0-5
  spicy: number;   // 辣 0-5
  sweet: number;   // 甜 0-5
  aromatic: number; // 香 0-5
  sour: number;    // 酸 0-5
  rich: number;    // 浓 0-5
}

export interface FoodPhoto {
  id: string;
  url: string;
  isCover: boolean;
}

export interface FoodRecord {
  id: string;
  dishName: string;
  restaurantName: string;
  restaurantAddress?: string;
  latitude?: number;
  longitude?: number;
  cuisineTags: string[];
  overallRating?: number;
  flavor?: FlavorProfile;
  tastingNotes?: string;
  costPerPerson?: number;
  photos: FoodPhoto[];
  recordDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isScratched: boolean;
}

// 菜系预设标签
export const CUISINE_TAGS = [
  "川菜", "粤菜", "湘菜", "鲁菜", "苏菜", "浙菜", "闽菜", "徽菜",
  "日料", "韩餐", "泰餐", "越南菜", "印度菜",
  "西餐", "意餐", "法餐", "美式",
  "火锅", "烧烤", "小吃", "甜品", "饮品", "面食", "海鲜",
  "新疆菜", "云南菜", "东北菜", "本帮菜",
  "素食", "轻食", "早午餐",
] as const;

export type CuisineTag = (typeof CUISINE_TAGS)[number];

// 味觉称号
export interface FlavorTitle {
  name: string;
  condition: (avg: FlavorProfile) => boolean;
}

export const FLAVOR_TITLES: FlavorTitle[] = [
  { name: "鲜辣派 · 深度探索者", condition: (f) => f.umami >= 3.5 && f.spicy >= 3.5 },
  { name: "甘香系 · 温柔美食家", condition: (f) => f.sweet >= 3.5 && f.aromatic >= 3.5 },
  { name: "酸辣狂人 · 味觉冒险家", condition: (f) => f.sour >= 3.5 && f.spicy >= 3.5 },
  { name: "浓香控 · 老饕本饕", condition: (f) => f.rich >= 3.5 && f.aromatic >= 3.5 },
  { name: "清鲜派 · 自然主义者", condition: (f) => f.umami >= 3.5 && f.sour >= 3 && f.rich < 2.5 },
  { name: "全能味蕾 · 杂食行者", condition: () => true }, // fallback
];
