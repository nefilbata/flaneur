"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { CalendarView } from "@/components/calendar/calendar-view";
import {
  RecordModal,
  type RecordFormData,
} from "@/components/record-form/record-modal";
import { createRecord, getRecordsByMonth, uploadPhoto } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { FoodRecord } from "@/types/food-record";

const DEMO_RECORDS: FoodRecord[] = [
  {
    id: "1",
    dishName: "麻辣火锅",
    restaurantName: "海底捞",
    cuisineTags: ["火锅", "川菜"],
    overallRating: 4,
    flavor: { umami: 4, spicy: 5, sweet: 1, aromatic: 3, sour: 1, rich: 4 },
    tastingNotes: "牛油锅底够香，毛肚七上八下刚刚好。",
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop",
        isCover: true,
      },
    ],
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
    photos: [
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop",
        isCover: true,
      },
    ],
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
    photos: [
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
        isCover: true,
      },
    ],
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
    photos: [
      {
        id: "p4",
        url: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=400&h=400&fit=crop",
        isCover: true,
      },
    ],
    recordDate: "2026-04-18",
    createdAt: "2026-04-18T12:00:00Z",
  },
  {
    id: "5",
    dishName: "提拉米苏",
    restaurantName: "Cafe Luna",
    cuisineTags: ["甜品", "意餐"],
    overallRating: 5,
    flavor: { umami: 1, spicy: 0, sweet: 4, aromatic: 4, sour: 0, rich: 5 },
    tastingNotes: "咖啡味浓郁，马斯卡彭绵密。",
    photos: [
      {
        id: "p5",
        url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop",
        isCover: true,
      },
    ],
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
    photos: [
      {
        id: "p6",
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
        isCover: true,
      },
    ],
    recordDate: "2026-04-25",
    createdAt: "2026-04-25T19:30:00Z",
  },
];

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const [records, setRecords] = useState<FoodRecord[]>(DEMO_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );
  const [visibleMonth, setVisibleMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadRecords = useCallback(async (year: number, month: number) => {
    if (!isSupabaseConfigured) {
      setRecords(DEMO_RECORDS);
      return;
    }

    try {
      const nextRecords = await getRecordsByMonth(year, month);
      setRecords(nextRecords);
    } catch (error) {
      console.error("Failed to load Supabase records, using demo fallback.", error);
      setRecords(DEMO_RECORDS);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() =>
      loadRecords(visibleMonth.year, visibleMonth.month)
    );
  }, [loadRecords, visibleMonth.month, visibleMonth.year]);

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    const existing = records.find((record) => record.recordDate === date);
    if (!existing) {
      setIsModalOpen(true);
    }
  };

  const handleMonthChange = useCallback((year: number, month: number) => {
    setVisibleMonth((current) =>
      current.year === year && current.month === month ? current : { year, month }
    );
  }, []);

  const handleSave = async (data: RecordFormData) => {
    if (!isSupabaseConfigured) {
      const localRecord: FoodRecord = {
        id: crypto.randomUUID(),
        dishName: data.dishName,
        restaurantName: data.restaurantName,
        restaurantAddress: data.restaurantAddress || undefined,
        cuisineTags: data.cuisineTags,
        overallRating: data.overallRating || undefined,
        flavor: data.flavor,
        tastingNotes: data.tastingNotes || undefined,
        costPerPerson: data.costPerPerson
          ? Number(data.costPerPerson)
          : undefined,
        photos: [],
        recordDate: data.recordDate,
        createdAt: new Date().toISOString(),
      };
      setRecords((current) => [...current, localRecord]);
      return;
    }

    setIsSaving(true);
    try {
      const photoUrls = await Promise.all(data.photos.map(uploadPhoto));
      await createRecord({
        dishName: data.dishName,
        restaurantName: data.restaurantName,
        restaurantAddress: data.restaurantAddress || undefined,
        cuisineTags: data.cuisineTags,
        overallRating: data.overallRating || undefined,
        flavor: data.flavor,
        tastingNotes: data.tastingNotes || undefined,
        costPerPerson: data.costPerPerson ? Number(data.costPerPerson) : undefined,
        recordDate: data.recordDate,
        photoUrls,
      });
      await loadRecords(visibleMonth.year, visibleMonth.month);
    } catch (error) {
      console.error("Failed to save record.", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in-up">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl tracking-wide text-charcoal md:text-5xl">
          Flaneur
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-muted">
          用味蕾漫游城市
        </p>
      </div>

      <CalendarView
        records={records}
        onDayClick={handleDayClick}
        onMonthChange={handleMonthChange}
      />

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedDate(new Date().toISOString().split("T")[0]);
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 z-30 flex size-14 items-center justify-center rounded-full bg-primary-strong text-white shadow-lg transition-shadow duration-200 hover:shadow-xl"
        aria-label="添加美食记录"
      >
        <Plus className="size-6" />
      </motion.button>

      <RecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSave}
      />

      {isSaving && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto w-fit rounded-full bg-charcoal px-4 py-2 text-sm text-white shadow-lg">
          正在保存...
        </div>
      )}
    </div>
  );
}
