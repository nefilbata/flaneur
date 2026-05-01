export interface FlavorProfile {
  umami: number;
  spicy: number;
  sweet: number;
  aromatic: number;
  sour: number;
  rich: number;
}

export interface FoodPhoto {
  id: string;
  url: string;
  isCover: boolean;
  sortOrder?: number;
}

export interface FoodRecord {
  id: string;
  userId?: string;
  dishName: string;
  restaurantName: string;
  restaurantAddress?: string;
  latitude?: number;
  longitude?: number;
  cuisineTags: string[];
  overallRating?: number;
  flavor: FlavorProfile;
  tastingNotes?: string;
  costPerPerson?: number;
  stickerUrl?: string;
  photos: FoodPhoto[];
  recordDate: string;
  createdAt: string;
}

export interface NewFoodRecord {
  userId?: string;
  dishName: string;
  restaurantName: string;
  restaurantAddress?: string;
  latitude?: number;
  longitude?: number;
  cuisineTags?: string[];
  overallRating?: number;
  flavor?: Partial<FlavorProfile>;
  tastingNotes?: string;
  costPerPerson?: number;
  recordDate: string;
  photoUrls?: string[];
}

export interface Achievement {
  id: string;
  userId?: string;
  key: string;
  name: string;
  description: string;
  unlockedAt?: string;
  isScratched: boolean;
}

export const CUISINE_TAGS = [
  "\u5ddd\u83dc",
  "\u7ca4\u83dc",
  "\u6e58\u83dc",
  "\u9c81\u83dc",
  "\u82cf\u83dc",
  "\u6d59\u83dc",
  "\u95fd\u83dc",
  "\u5fbd\u83dc",
  "\u65e5\u6599",
  "\u97e9\u9910",
  "\u6cf0\u9910",
  "\u8d8a\u5357\u83dc",
  "\u5370\u5ea6\u83dc",
  "\u897f\u9910",
  "\u610f\u9910",
  "\u6cd5\u9910",
  "\u7f8e\u5f0f",
  "\u706b\u9505",
  "\u70e7\u70e4",
  "\u5c0f\u5403",
  "\u751c\u54c1",
  "\u996e\u54c1",
  "\u9762\u98df",
  "\u6d77\u9c9c",
  "\u65b0\u7586\u83dc",
  "\u4e91\u5357\u83dc",
  "\u4e1c\u5317\u83dc",
  "\u672c\u5e2e\u83dc",
  "\u7d20\u98df",
  "\u8f7b\u98df",
  "\u65e9\u5348\u9910",
] as const;

export type CuisineTag = (typeof CUISINE_TAGS)[number];

export interface FlavorTitle {
  name: string;
  condition: (avg: FlavorProfile) => boolean;
}

export const FLAVOR_TITLES: FlavorTitle[] = [
  {
    name: "\u9c9c\u8fa3\u6d3e · \u6df1\u5ea6\u63a2\u7d22\u8005",
    condition: (f) => f.umami >= 3.5 && f.spicy >= 3.5,
  },
  {
    name: "\u751c\u9999\u7cfb · \u6e29\u67d4\u7f8e\u98df\u5bb6",
    condition: (f) => f.sweet >= 3.5 && f.aromatic >= 3.5,
  },
  {
    name: "\u9178\u8fa3\u6d3e · \u5473\u89c9\u5192\u9669\u5bb6",
    condition: (f) => f.sour >= 3.5 && f.spicy >= 3.5,
  },
  {
    name: "\u6d53\u9999\u6d3e · \u8001\u9955\u672c\u9955",
    condition: (f) => f.rich >= 3.5 && f.aromatic >= 3.5,
  },
  {
    name: "\u6e05\u9c9c\u6d3e · \u81ea\u7136\u4e3b\u4e49\u8005",
    condition: (f) => f.umami >= 3.5 && f.sour >= 3 && f.rich < 2.5,
  },
  {
    name: "\u5168\u80fd\u5473\u857e · \u6742\u98df\u884c\u8005",
    condition: () => true,
  },
];
