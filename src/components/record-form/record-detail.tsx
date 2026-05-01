"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Star, X } from "lucide-react";
import type { FoodRecord } from "@/types/food-record";

interface RecordDetailProps {
  isOpen: boolean;
  onClose: () => void;
  record: FoodRecord | null;
}

const FLAVOR_LABELS: {
  key: keyof FoodRecord["flavor"];
  label: string;
  emoji: string;
}[] = [
  { key: "umami", label: "鲜", emoji: "🍣" },
  { key: "spicy", label: "辣", emoji: "🌶️" },
  { key: "sweet", label: "甜", emoji: "🍰" },
  { key: "aromatic", label: "香", emoji: "🌿" },
  { key: "sour", label: "酸", emoji: "🍋" },
  { key: "rich", label: "浓", emoji: "🥘" },
];

export function RecordDetail({ isOpen, onClose, record }: RecordDetailProps) {
  if (!record) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-charcoal/30 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%", opacity: 0.96 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[70] max-h-[88vh] overflow-y-auto rounded-t-3xl bg-surface shadow-[0_-8px_40px_rgba(44,44,44,0.12)] md:bottom-auto md:left-1/2 md:right-auto md:top-28 md:max-h-[calc(100vh-9rem)] md:w-[min(680px,calc(100vw-4rem))] md:-translate-x-1/2 md:rounded-3xl md:shadow-[0_20px_70px_rgba(44,44,44,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 rounded-t-3xl bg-surface pb-2 pt-3">
              <div className="mx-auto h-1 w-10 rounded-full bg-border" />
            </div>

            <div className="px-6 pb-8 md:px-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl text-charcoal">{record.dishName}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                    <MapPin className="size-3.5" />
                    {record.restaurantName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-soft transition-colors hover:bg-border"
                  aria-label="关闭详情"
                >
                  <X className="size-5 text-muted" />
                </button>
              </div>

              {record.photos.length > 0 && (
                <div className="-mx-1 mb-5 flex gap-3 overflow-x-auto px-1 pb-3">
                  {record.photos.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm md:size-64"
                    >
                      <Image
                        src={photo.url}
                        alt={record.dishName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-muted">{record.recordDate}</span>
                {record.overallRating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          star <= record.overallRating!
                            ? "fill-warning text-warning"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {record.cuisineTags.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {record.cuisineTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary-strong"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="card mb-5 p-4">
                <p className="mb-3 text-sm text-muted">风味评分</p>
                <div className="grid grid-cols-3 gap-3">
                  {FLAVOR_LABELS.map(({ key, label, emoji }) => {
                    const value = record.flavor[key];
                    return (
                      <div key={key} className="text-center">
                        <span className="text-lg">{emoji}</span>
                        <p className="mt-0.5 text-xs text-muted">{label}</p>
                        <div className="mt-1 flex justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((point) => (
                            <div
                              key={point}
                              className={`size-2 rounded-full ${
                                point <= value ? "bg-primary-strong" : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {record.tastingNotes && (
                <div className="mb-5">
                  <p className="mb-1.5 text-sm text-muted">品鉴笔记</p>
                  <p className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-charcoal">
                    {record.tastingNotes}
                  </p>
                </div>
              )}

              {record.costPerPerson && (
                <div className="text-sm text-muted">
                  人均消费：
                  <span className="font-medium text-charcoal">
                    ¥{record.costPerPerson}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
