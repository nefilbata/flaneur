"use client";

import { motion } from "framer-motion";
import type { FoodRecord } from "@/types/food-record";

interface DayCellProps {
  day: number | null; // null = empty cell (padding)
  isToday: boolean;
  record?: FoodRecord;
  onClick?: () => void;
}

export function DayCell({ day, isToday, record, onClick }: DayCellProps) {
  if (day === null) {
    return <div className="aspect-square" />;
  }

  const hasRecord = !!record;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative aspect-square rounded-2xl overflow-hidden
        transition-all duration-200 cursor-pointer
        flex items-center justify-center
        ${isToday
          ? "ring-2 ring-primary-strong ring-offset-2 ring-offset-background"
          : ""
        }
        ${hasRecord
          ? "shadow-md hover:shadow-lg"
          : "border-2 border-dashed border-border hover:border-primary/50 hover:bg-soft/50"
        }
      `}
    >
      {/* 有记录：显示美食图片 */}
      {hasRecord && record?.photos?.[0] ? (
        <>
          <img
            src={record.photos[0].url}
            alt={record.dishName}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 底部渐变遮罩 + 日期 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white text-xs font-medium drop-shadow-sm">
            {day}
          </span>
        </>
      ) : hasRecord ? (
        /* 有记录但没图片 */
        <div className="w-full h-full bg-primary/15 flex flex-col items-center justify-center gap-0.5">
          <span className="text-lg">🍽</span>
          <span className="text-xs text-muted">{day}</span>
        </div>
      ) : (
        /* 无记录 */
        <span className={`text-sm ${isToday ? "font-semibold text-primary-strong" : "text-muted"}`}>
          {day}
        </span>
      )}

      {/* 今日指示点 */}
      {isToday && !hasRecord && (
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-strong" />
      )}
    </motion.button>
  );
}
