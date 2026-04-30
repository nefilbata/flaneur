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
import { DEMO_RECORDS } from "@/lib/demo-records";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { FoodRecord } from "@/types/food-record";

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
