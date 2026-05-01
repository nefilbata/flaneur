"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Images, Plus, Sparkles, UsersRound } from "lucide-react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { RecordModal, type RecordFormData } from "@/components/record-form/record-modal";
import { RecordDetail } from "@/components/record-form/record-detail";
import { SpinModal } from "@/components/spin-wheel/spin-modal";
import { getDailyQuote } from "@/lib/daily-quotes";
import { DEMO_RECORDS } from "@/lib/demo-records";
import type { FoodRecord } from "@/types/food-record";

export default function HomePage() {
  const [records, setRecords] = useState<FoodRecord[]>(DEMO_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinOpen, setIsSpinOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [detailRecord, setDetailRecord] = useState<FoodRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const quote = getDailyQuote();

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    const existing = records.find((record) => record.recordDate === date);
    if (existing) {
      setDetailRecord(existing);
      setIsDetailOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCreateRecord = (data: RecordFormData) => {
    const newRecord: FoodRecord = {
      id: `local-${Date.now()}`,
      dishName: data.dishName,
      restaurantName: data.restaurantName,
      restaurantAddress: data.restaurantAddress,
      cuisineTags: data.cuisineTags,
      overallRating: data.overallRating || undefined,
      flavor: data.flavor,
      tastingNotes: data.tastingNotes,
      costPerPerson: data.costPerPerson ? Number(data.costPerPerson) : undefined,
      stickerUrl: data.stickerUrl,
      photos: data.photos.map((file, index) => ({
        id: `local-photo-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        isCover: index === 0,
        sortOrder: index,
      })),
      recordDate: data.recordDate,
      createdAt: new Date().toISOString(),
    };

    setRecords((current) => [
      newRecord,
      ...current.filter((record) => record.recordDate !== newRecord.recordDate),
    ]);
  };

  const handleUpdateRecord = (updated: FoodRecord) => {
    setRecords((current) =>
      current.map((record) => (record.id === updated.id ? updated : record))
    );
    setDetailRecord(updated);
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in-up pb-28 sm:pb-24">
      <div className="mb-5 text-center sm:mb-8">
        <h1 className="font-serif text-3xl tracking-wide text-charcoal sm:text-4xl md:text-5xl">
          Fl{"\u00e2"}neur
        </h1>
        <p className="mt-1.5 text-xs uppercase tracking-widest text-muted sm:mt-2 sm:text-sm">
          {"\u7528\u5473\u857e\u6f2b\u6e38\u57ce\u5e02"}
        </p>
      </div>

      <CalendarView records={records} onDayClick={handleDayClick} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="card mt-4 px-4 py-3.5 sm:mt-5 sm:px-5 sm:py-4"
      >
        <p className="font-serif text-sm leading-6 text-charcoal sm:text-base sm:leading-7">
          {"\u300c"}
          {quote.text}
          {"\u300d"}
        </p>
        {quote.source && (
          <p className="mt-2 text-right text-[11px] text-muted sm:text-xs">
            {quote.source}
          </p>
        )}
      </motion.div>

      <button
        type="button"
        onClick={() => setIsSpinOpen(true)}
        className="card mt-3 flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:-translate-y-0.5 sm:mt-4 sm:px-5 sm:py-4"
      >
        <span>
          <span className="block font-serif text-lg text-charcoal sm:text-xl">
            {"\u4eca\u5929\u5403\u4ec0\u4e48\uff1f"}
          </span>
          <span className="mt-1 block text-xs text-muted sm:text-sm">
            {"\u628a\u9009\u62e9\u56f0\u96be\u4ea4\u7ed9\u8f6c\u76d8"}
          </span>
        </span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-soft text-primary-strong sm:size-11">
          <Sparkles className="size-4 sm:size-5" />
        </span>
      </button>

      <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2">
        <Link
          href="/stickers"
          className="card flex items-center gap-3 p-3.5 transition hover:-translate-y-0.5 sm:gap-4 sm:p-4"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-soft text-primary-strong sm:size-11">
            <Images className="size-4 sm:size-5" />
          </span>
          <span>
            <span className="block font-serif text-base text-charcoal sm:text-lg">
              {"\u8d34\u7eb8\u518c"}
            </span>
            <span className="text-[11px] text-muted sm:text-xs">
              {"\u6536\u85cf\u6bcf\u4e00\u9910\u7684\u5c0f\u56fe\u7247"}
            </span>
          </span>
        </Link>

        <Link
          href="/buddy"
          className="card flex items-center gap-3 p-3.5 transition hover:-translate-y-0.5 sm:gap-4 sm:p-4"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-soft text-primary-strong sm:size-11">
            <UsersRound className="size-4 sm:size-5" />
          </span>
          <span>
            <span className="block font-serif text-base text-charcoal sm:text-lg">
              {"\u6f2b\u6e38\u642d\u6863"}
            </span>
            <span className="text-[11px] text-muted sm:text-xs">
              {"\u5373\u5c06\u4e0a\u7ebf\uff0c\u548c\u670b\u53cb\u4e00\u8d77\u8bb0\u5f55"}
            </span>
          </span>
        </Link>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedDate(new Date().toISOString().split("T")[0]);
          setIsModalOpen(true);
        }}
        className="fixed bottom-[calc(3.4rem+16px+env(safe-area-inset-bottom))] right-5 z-30 flex size-12 items-center justify-center rounded-full bg-primary text-surface shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] md:bottom-8 md:right-8"
        aria-label="Add record"
      >
        <Plus className="size-5" strokeWidth={2} />
      </motion.button>

      <RecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleCreateRecord}
      />

      <RecordDetail
        key={detailRecord?.id ?? "record-detail"}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailRecord(null);
        }}
        onSave={handleUpdateRecord}
        record={detailRecord}
      />

      <SpinModal isOpen={isSpinOpen} onClose={() => setIsSpinOpen(false)} />
    </div>
  );
}
