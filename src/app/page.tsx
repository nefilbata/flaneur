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
  const [addPresses, setAddPresses] = useState(0);
  const quote = getDailyQuote();

  const today = new Date().toISOString().split("T")[0];
  const todaysRecord = records.find((record) => record.recordDate === today);
  const latestRecords = records.slice(0, 3);

  const openRecordForm = (date = today) => {
    setSelectedDate(date);
    setAddPresses((current) => current + 1);
    setIsModalOpen(true);
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    const existing = records.find((record) => record.recordDate === date);
    if (existing) {
      setDetailRecord(existing);
      setIsDetailOpen(true);
    } else {
      openRecordForm(date);
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
    <div className="mx-auto max-w-6xl animate-fade-in-up pb-20 md:pb-12">
      <header className="mb-5 flex flex-col gap-4 sm:mb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-muted">
            Taste journal
          </p>
          <h1 className="mt-1 font-serif text-4xl tracking-wide text-charcoal md:text-5xl">
            Fl{"\u00e2"}neur
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            用味蕾漫游城市，把今天这一餐收进自己的食物地图。
          </p>
        </div>

        <AddRecordButton
          presses={addPresses}
          label={todaysRecord ? "补一餐" : "记录今天"}
          onClick={() => openRecordForm()}
        />
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.12fr)_360px] lg:items-start">
        <div className="min-w-0">
          <CalendarView records={records} onDayClick={handleDayClick} />
        </div>

        <aside className="space-y-4">
          <section className="rounded-[22px] border border-border bg-surface px-5 py-5 shadow-[0_12px_36px_rgba(44,44,44,0.07)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Today
                </p>
                <h2 className="mt-2 font-serif text-2xl text-charcoal">
                  {todaysRecord ? todaysRecord.dishName : "今天吃什么？"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {todaysRecord
                    ? todaysRecord.restaurantName
                    : "把选择困难交给转盘，也可以直接记一餐。"}
                </p>
              </div>
              <motion.button
                type="button"
                whileTap={{ rotate: 18, scale: 0.94 }}
                onClick={() => (todaysRecord ? openRecordForm() : setIsSpinOpen(true))}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-soft text-primary-strong transition hover:bg-border"
                aria-label={todaysRecord ? "新增一餐" : "打开转盘"}
              >
                {todaysRecord ? (
                  <Plus className="size-5" strokeWidth={2} />
                ) : (
                  <Sparkles className="size-5" strokeWidth={1.7} />
                )}
              </motion.button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsSpinOpen(true)}
                className="rounded-2xl bg-background px-3 py-3 text-left text-sm text-charcoal transition hover:bg-soft"
              >
                转盘灵感
                <span className="mt-1 block text-xs text-muted">先选方向</span>
              </button>
              <button
                type="button"
                onClick={() => openRecordForm()}
                className="rounded-2xl bg-primary text-left text-sm font-medium text-surface shadow-[0_8px_20px_rgba(173,133,129,0.22)] transition hover:bg-primary-strong"
              >
                记一餐
                <span className="mt-1 block text-xs font-normal text-surface/80">
                  照片、评分、笔记
                </span>
              </button>
            </div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-[22px] border border-border bg-surface px-5 py-5"
          >
            <p className="font-serif text-base leading-7 text-charcoal">
              {"「"}
              {quote.text}
              {"」"}
            </p>
            {quote.source && (
              <p className="mt-3 text-right text-xs text-muted">{quote.source}</p>
            )}
          </motion.section>

          <div className="grid grid-cols-2 gap-3">
            <ActionLink
              href="/stickers"
              icon={<Images className="size-4" />}
              title="贴纸册"
              detail="收藏小图片"
            />
            <ActionLink
              href="/buddy"
              icon={<UsersRound className="size-4" />}
              title="漫游搭档"
              detail="未来一起记"
            />
          </div>

          <section className="rounded-[22px] border border-border bg-surface px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-charcoal">最近记录</h2>
              <span className="text-xs text-muted">{records.length} 餐</span>
            </div>
            <div className="space-y-3">
              {latestRecords.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => {
                    setDetailRecord(record);
                    setIsDetailOpen(true);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl bg-background px-3 py-3 text-left transition hover:bg-soft"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-charcoal">
                      {record.dishName}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {record.restaurantName}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {record.recordDate.slice(5)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

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

function AddRecordButton({
  presses,
  label,
  onClick,
}: {
  presses: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-surface shadow-[0_10px_24px_rgba(173,133,129,0.24)] transition hover:bg-primary-strong"
    >
      <motion.span
        key={presses}
        initial={{ rotate: -45, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="grid size-5 place-items-center"
      >
        <Plus className="size-5" strokeWidth={2} />
      </motion.span>
      {label}
    </motion.button>
  );
}

function ActionLink({
  href,
  icon,
  title,
  detail,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[22px] border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(44,44,44,0.08)]"
    >
      <span className="grid size-10 place-items-center rounded-full bg-soft text-primary-strong">
        {icon}
      </span>
      <span className="mt-3 block font-serif text-base text-charcoal">{title}</span>
      <span className="mt-1 block text-xs text-muted">{detail}</span>
    </Link>
  );
}
