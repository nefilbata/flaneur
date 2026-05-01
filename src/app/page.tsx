"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { RecordModal } from "@/components/record-form/record-modal";
import { RecordDetail } from "@/components/record-form/record-detail";
import { DEMO_RECORDS } from "@/lib/demo-records";
import type { FoodRecord } from "@/types/food-record";

export default function HomePage() {
  const [records] = useState<FoodRecord[]>(DEMO_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [detailRecord, setDetailRecord] = useState<FoodRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
          Flaneur
        </h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-muted">
          用味蕾漫游城市
        </p>
      </div>

      <CalendarView records={records} onDayClick={handleDayClick} />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedDate(new Date().toISOString().split("T")[0]);
          setIsModalOpen(true);
        }}
        className="fixed bottom-24 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-primary-strong text-surface shadow-lg transition-shadow duration-200 hover:shadow-xl md:bottom-8 md:right-8"
        aria-label="添加记录"
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
    </div>
  );
}
