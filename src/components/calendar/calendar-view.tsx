"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayCell } from "@/components/calendar/day-cell";
import type { FoodRecord } from "@/types/food-record";

interface CalendarViewProps {
  records: FoodRecord[];
  onDayClick?: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

const WEEKDAYS = [
  "\u65e5",
  "\u4e00",
  "\u4e8c",
  "\u4e09",
  "\u56db",
  "\u4e94",
  "\u516d",
];
const MONTHS = [
  "\u4e00\u6708",
  "\u4e8c\u6708",
  "\u4e09\u6708",
  "\u56db\u6708",
  "\u4e94\u6708",
  "\u516d\u6708",
  "\u4e03\u6708",
  "\u516b\u6708",
  "\u4e5d\u6708",
  "\u5341\u6708",
  "\u5341\u4e00\u6708",
  "\u5341\u4e8c\u6708",
];

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay();
}

function formatDate(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CalendarView({
  records,
  onDayClick,
  onMonthChange,
}: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    onMonthChange?.(currentYear, currentMonth + 1);
  }, [currentMonth, currentYear, onMonthChange]);

  const recordMap = useMemo(() => {
    const map: Record<string, FoodRecord> = {};
    records.forEach((record) => {
      map[record.recordDate] = record;
    });
    return map;
  }, [records]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const monthRecords = records.filter((record) => {
    const date = new Date(`${record.recordDate}T00:00:00`);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });
  const uniqueRestaurants = new Set(
    monthRecords.map((record) => record.restaurantName)
  ).size;

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
    <div className="card p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrev}
          className="grid size-11 place-items-center rounded-full bg-soft text-muted transition-colors duration-200 hover:bg-border hover:text-charcoal"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="text-center">
          <h2 className="font-serif text-2xl tracking-wide text-charcoal md:text-3xl">
            {MONTHS[currentMonth]}
          </h2>
          <p className="mt-0.5 text-sm text-muted">{currentYear}</p>
        </div>

        <button
          type="button"
          onClick={goToNext}
          className="grid size-11 place-items-center rounded-full bg-soft text-muted transition-colors duration-200 hover:bg-border hover:text-charcoal"
          aria-label="Next month"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 text-center text-xs font-medium text-muted">
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-1.5 sm:gap-2"
        >
          {cells.map((day, index) => {
            const date = day ? formatDate(currentYear, currentMonth, day) : "";
            const isToday = isCurrentMonth && day === today.getDate();

            return (
              <DayCell
                key={`${date}-${index}`}
                day={day}
                isToday={isToday}
                record={day ? recordMap[date] : undefined}
                onClick={() => day && onDayClick?.(date)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 border-t border-border pt-5">
        <div className="grid grid-cols-3 gap-3">
          <StatBlock label={"\u672c\u6708\u8bb0\u5f55"} value={monthRecords.length} suffix={"\u6b21"} />
          <StatBlock label={"\u63a2\u8bbf\u9910\u5385"} value={uniqueRestaurants} suffix={"\u5bb6"} />
          <div>
            <p className="text-xs text-muted sm:text-sm">{"\u6700\u7231\u83dc\u7cfb"}</p>
            <p className="mt-0.5 font-serif text-lg text-charcoal">
              {monthRecords.length > 0 ? getMostFrequentCuisine(monthRecords) : "\u6682\u65e0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted sm:text-sm">{label}</p>
      <p className="mt-0.5 font-serif text-2xl text-charcoal">
        {value}
        <span className="ml-1.5 font-sans text-sm text-muted">{suffix}</span>
      </p>
    </div>
  );
}

function getMostFrequentCuisine(records: FoodRecord[]): string {
  const count: Record<string, number> = {};
  records.forEach((record) => {
    record.cuisineTags.forEach((tag) => {
      count[tag] = (count[tag] || 0) + 1;
    });
  });

  return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "\u6682\u65e0";
}
