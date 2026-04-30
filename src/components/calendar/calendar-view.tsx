"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayCell } from "./day-cell";
import type { FoodRecord } from "@/types/food-record";

interface CalendarViewProps {
  records: FoodRecord[];
  onDayClick?: (date: string) => void;
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTHS = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CalendarView({ records, onDayClick }: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next

  // 按日期索引记录
  const recordMap = useMemo(() => {
    const map: Record<string, FoodRecord> = {};
    records.forEach((r) => {
      map[r.recordDate] = r;
    });
    return map;
  }, [records]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // 构建日历格子
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // 本月统计
  const monthRecords = records.filter((r) => {
    const d = new Date(r.recordDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });
  const uniqueRestaurants = new Set(monthRecords.map((r) => r.restaurantName)).size;

  const goToPrev = () => {
    setDirection(-1);
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNext = () => {
    setDirection(1);
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isCurrentMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  return (
    <div className="card p-6 md:p-8">
      {/* ── 月份导航 ── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrev}
          className="w-10 h-10 rounded-full flex items-center justify-center
                     hover:bg-soft transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-muted" />
        </button>

        <div className="text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-charcoal">
            {MONTHS[currentMonth]}
          </h2>
          <p className="text-sm text-muted mt-0.5">{currentYear}</p>
        </div>

        <button
          onClick={goToNext}
          className="w-10 h-10 rounded-full flex items-center justify-center
                     hover:bg-soft transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* ── 星期标题行 ── */}
      <div className="grid grid-cols-7 mb-3">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* ── 日历网格 ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-2"
        >
          {cells.map((day, i) => {
            const dateStr = day ? formatDate(currentYear, currentMonth, day) : "";
            const isToday =
              isCurrentMonth && day === today.getDate();
            return (
              <DayCell
                key={i}
                day={day}
                isToday={isToday}
                record={day ? recordMap[dateStr] : undefined}
                onClick={() => day && onDayClick?.(dateStr)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* ── 本月统计 ── */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">本月记录</p>
            <p className="text-2xl font-serif text-charcoal mt-0.5">
              {monthRecords.length}
              <span className="text-sm text-muted font-sans ml-1.5">次打卡</span>
            </p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-sm text-muted">探访餐厅</p>
            <p className="text-2xl font-serif text-charcoal mt-0.5">
              {uniqueRestaurants}
              <span className="text-sm text-muted font-sans ml-1.5">家</span>
            </p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-sm text-muted">最爱菜系</p>
            <p className="text-lg font-serif text-charcoal mt-0.5">
              {monthRecords.length > 0
                ? getMostFrequentCuisine(monthRecords)
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── helper ── */
function getMostFrequentCuisine(records: FoodRecord[]): string {
  const count: Record<string, number> = {};
  records.forEach((r) =>
    r.cuisineTags.forEach((t) => {
      count[t] = (count[t] || 0) + 1;
    })
  );
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "—";
}
