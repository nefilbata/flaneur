"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { RecordModal } from "@/components/record-form/record-modal";
import type { FoodRecord } from "@/types/food-record";

/* ── 模拟数据（后续接 Supabase 后删除） ── */
const DEMO_RECORDS: FoodRecord[] = [
  {
    id: "1",
    dishName: "麻辣火锅",
    restaurantName: "海底捞",
    cuisineTags: ["火锅", "川菜"],
    overallRating: 4,
    flavor: { umami: 4, spicy: 5, sweet: 1, aromatic: 3, sour: 1, rich: 4 },
    tastingNotes: "牛油锅底够香，毛肚七上八下刚刚好。",
    photos: [{ id: "p1", url: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop", isCover: true }],
    recordDate: "2026-04-03",
    createdAt: "2026-04-03T19:00:00Z",
  },
  {
    id: "2",
    dishName: "握寿司拼盘",
    restaurantName: "鮨 · 初心",
    cuisineTags: ["日料", "海鲜"],
    overallRating: 5,
    flavor: { umami: 5, spicy: 0, sweet: 2, aromatic: 3, sour: 1, rich: 3 },
    tastingNotes: "中腹入口即化，赤身的铁味恰到好处。",
    photos: [{ id: "p2", url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop", isCover: true }],
    recordDate: "2026-04-08",
    createdAt: "2026-04-08T12:30:00Z",
  },
  {
    id: "3",
    dishName: "蛋黄酥",
    restaurantName: "鲍师傅",
    cuisineTags: ["甜品", "小吃"],
    overallRating: 4,
    flavor: { umami: 2, spicy: 0, sweet: 4, aromatic: 3, sour: 0, rich: 4 },
    tastingNotes: "外酥内软，蛋黄流心。",
    photos: [{ id: "p3", url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop", isCover: true }],
    recordDate: "2026-04-12",
    createdAt: "2026-04-12T15:00:00Z",
  },
  {
    id: "4",
    dishName: "酸汤肥牛",
    restaurantName: "外婆家",
    cuisineTags: ["川菜"],
    overallRating: 4,
    flavor: { umami: 3, spicy: 3, sweet: 1, aromatic: 2, sour: 4, rich: 3 },
    tastingNotes: "酸汤底很开胃，肥牛嫩滑。",
    photos: [{ id: "p4", url: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=400&h=400&fit=crop", isCover: true }],
    recordDate: "2026-04-18",
    createdAt: "2026-04-18T12:00:00Z",
  },
  {
    id: "5",
    dishName: "提拉米苏",
    restaurantName: "Café Luna",
    cuisineTags: ["甜品", "意餐"],
    overallRating: 5,
    flavor: { umami: 1, spicy: 0, sweet: 4, aromatic: 4, sour: 0, rich: 5 },
    tastingNotes: "咖啡味浓郁，马斯卡彭绵密。这是目前吃过最好的提拉米苏。",
    photos: [{ id: "p5", url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop", isCover: true }],
    recordDate: "2026-04-22",
    createdAt: "2026-04-22T16:00:00Z",
  },
  {
    id: "6",
    dishName: "烤羊排",
    restaurantName: "西贝莜面村",
    cuisineTags: ["烧烤", "新疆菜"],
    overallRating: 4,
    flavor: { umami: 3, spicy: 2, sweet: 1, aromatic: 5, sour: 0, rich: 4 },
    tastingNotes: "孜然味十足，外焦里嫩。",
    photos: [{ id: "p6", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop", isCover: true }],
    recordDate: "2026-04-25",
    createdAt: "2026-04-25T19:30:00Z",
  },
];

export default function HomePage() {
  const [records] = useState<FoodRecord[]>(DEMO_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    // 如果该日期已有记录，后续可以做详情展示
    // 如果没有记录，打开添加表单
    const existing = records.find((r) => r.recordDate === date);
    if (!existing) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in-up">
      {/* ── 页面标题 ── */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-charcoal">
          Flâneur
        </h1>
        <p className="text-muted text-sm mt-2 tracking-widest uppercase">
          用味蕾漫游城市
        </p>
      </div>

      {/* ── 日历 ── */}
      <CalendarView records={records} onDayClick={handleDayClick} />

      {/* ── 添加按钮（浮动） ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedDate(new Date().toISOString().split("T")[0]);
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full
                   bg-primary-strong text-white shadow-lg
                   hover:shadow-xl transition-shadow duration-200
                   flex items-center justify-center z-30"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* ── 添加记录弹窗 ── */}
      <RecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={(data) => {
          console.log("New record:", data);
          // TODO: 接 Supabase 保存
        }}
      />
    </div>
  );
}
