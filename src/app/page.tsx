"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { RecordModal } from "@/components/record-form/record-modal";
import { RecordDetail } from "@/components/record-form/record-detail";
import { SpinModal } from "@/components/spin-wheel/spin-modal";
import { getDailyQuote } from "@/lib/daily-quotes";
import { DEMO_RECORDS } from "@/lib/demo-records";
import type { FoodRecord } from "@/types/food-record";

export default function HomePage() {
  const [records] = useState<FoodRecord[]>(DEMO_RECORDS);
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

  return (
    <div className="mx-auto max-w-lg animate-fade-in-up">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl tracking-wide text-charcoal md:text-5xl">
          Fl{"\u00e2"}neur
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-muted">
          {"\u7528\u5473\u857e\u6f2b\u6e38\u57ce\u5e02"}
        </p>
      </div>

      <CalendarView records={records} onDayClick={handleDayClick} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="card mt-5 border-l-[3px] border-l-primary px-5 py-4"
      >
        <p className="font-serif text-base leading-7 text-charcoal">
          {"\u300c"}
          {quote.text}
          {"\u300d"}
        </p>
        {quote.source && (
          <p className="mt-2 text-right text-xs text-muted">
            {"\u2014\u2014 "}
            {quote.source}
          </p>
        )}
      </motion.div>

      <button
        type="button"
        onClick={() => setIsSpinOpen(true)}
        className="card mt-4 flex w-full items-center justify-between px-5 py-4 text-left transition hover:-translate-y-0.5"
      >
        <span>
          <span className="block font-serif text-xl text-charcoal">
            {"\u4eca\u5929\u5403\u4ec0\u4e48\uff1f"}
          </span>
          <span className="mt-1 block text-sm text-muted">
            {"\u628a\u9009\u62e9\u56f0\u96be\u4ea4\u7ed9\u8f6c\u76d8"}
          </span>
        </span>
        <span className="grid size-11 place-items-center rounded-full bg-soft text-primary-strong">
          <Sparkles className="size-5" />
        </span>
      </button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedDate(new Date().toISOString().split("T")[0]);
          setIsModalOpen(true);
        }}
        className="fixed bottom-24 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-primary-strong text-surface shadow-lg transition-shadow duration-200 hover:shadow-xl md:bottom-8 md:right-8"
        aria-label="Add record"
      >
        <Plus className="size-6" />
      </motion.button>

      <RecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={(data) => {
          console.log("New record:", data);
        }}
      />

      <RecordDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailRecord(null);
        }}
        record={detailRecord}
      />

      <SpinModal isOpen={isSpinOpen} onClose={() => setIsSpinOpen(false)} />
    </div>
  );
}
