"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Edit3, MapPin, Star, X } from "lucide-react";
import { AppModalPortal } from "@/components/ui/app-modal-portal";
import type { FlavorProfile, FoodRecord } from "@/types/food-record";

interface RecordDetailProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (record: FoodRecord) => void;
  record: FoodRecord | null;
}

const FLAVOR_LABELS: {
  key: keyof FlavorProfile;
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

export function RecordDetail({
  isOpen,
  onClose,
  onSave,
  record,
}: RecordDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<FoodRecord | null>(record);

  if (!record || !draft) return null;

  const updateDraft = <Key extends keyof FoodRecord>(
    key: Key,
    value: FoodRecord[Key]
  ) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const updateFlavor = (key: keyof FlavorProfile, value: number) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            flavor: { ...current.flavor, [key]: Math.max(0, Math.min(5, value)) },
          }
        : current
    );
  };

  const handleSave = () => {
    const cleaned: FoodRecord = {
      ...draft,
      dishName: draft.dishName.trim(),
      restaurantName: draft.restaurantName.trim(),
      restaurantAddress: draft.restaurantAddress?.trim(),
      tastingNotes: draft.tastingNotes?.trim(),
      cuisineTags: draft.cuisineTags.map((tag) => tag.trim()).filter(Boolean),
    };
    if (!cleaned.dishName || !cleaned.restaurantName) return;
    onSave?.(cleaned);
    setDraft(cleaned);
    setIsEditing(false);
  };

  return (
    <AppModalPortal
      isOpen={isOpen}
      onClose={onClose}
      variant="dialog"
      contentClassName="mt-[15dvh] max-h-[calc(85dvh-env(safe-area-inset-bottom)-1rem)] self-start"
    >
            <div className="sticky top-0 z-10 rounded-t-3xl bg-surface/95 px-5 pb-3 pt-4 backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  {isEditing ? (
                    <input
                      value={draft.dishName}
                      onChange={(event) => updateDraft("dishName", event.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 font-serif text-lg text-charcoal outline-none focus:border-primary"
                      aria-label="菜品名称"
                    />
                  ) : (
                    <h3 className="truncate font-serif text-xl text-charcoal">
                      {draft.dishName}
                    </h3>
                  )}
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <MapPin className="size-3.5 shrink-0" />
                    {isEditing ? "编辑餐厅信息" : draft.restaurantName}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing((current) => !current)}
                    className="flex size-9 items-center justify-center rounded-full bg-soft transition-colors hover:bg-border"
                    aria-label={isEditing ? "退出编辑" : "编辑记录"}
                  >
                    <Edit3 className="size-4 text-muted" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex size-9 items-center justify-center rounded-full bg-soft transition-colors hover:bg-border"
                    aria-label="关闭详情"
                  >
                    <X className="size-4 text-muted" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 pb-6 md:px-8">
              {record.photos.length > 0 && (
                <div className="-mx-1 mb-4 flex gap-3 overflow-x-auto px-1 pb-3">
                  {record.photos.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="relative size-44 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm sm:size-56 md:size-64"
                    >
                      <Image
                        src={photo.url}
                        alt={draft.dishName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}

              {isEditing ? (
                <EditFields draft={draft} updateDraft={updateDraft} />
              ) : (
                <ReadOnlyDetails record={draft} />
              )}

              <div className="card mb-5 p-4">
                <p className="mb-3 text-sm text-muted">风味评分</p>
                <div className="grid grid-cols-3 gap-3">
                  {FLAVOR_LABELS.map(({ key, label, emoji }) => {
                    const value = draft.flavor[key];
                    return (
                      <div key={key} className="text-center">
                        <span className="text-lg">{emoji}</span>
                        <p className="mt-0.5 text-xs text-muted">{label}</p>
                        {isEditing ? (
                          <div className="mt-1 flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((point) => (
                              <button
                                key={point}
                                type="button"
                                onClick={() => updateFlavor(key, point)}
                                className={`size-3 rounded-full ${
                                  point <= value ? "bg-primary-strong" : "bg-border"
                                }`}
                                aria-label={`${label} ${point} 分`}
                              />
                            ))}
                          </div>
                        ) : (
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {isEditing && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={!draft.dishName.trim() || !draft.restaurantName.trim()}
                  className="w-full rounded-2xl bg-primary-strong py-3.5 font-medium text-surface shadow-sm transition-all duration-200 hover:bg-primary-strong/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  保存修改
                </motion.button>
              )}
            </div>
    </AppModalPortal>
  );
}

function ReadOnlyDetails({ record }: { record: FoodRecord }) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
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

      {record.tastingNotes && (
        <div className="mb-5">
          <p className="mb-1.5 text-sm text-muted">品鉴笔记</p>
          <p className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-charcoal">
            {record.tastingNotes}
          </p>
        </div>
      )}

      {record.costPerPerson && (
        <div className="mb-5 text-sm text-muted">
          人均消费：
          <span className="font-medium text-charcoal">¥{record.costPerPerson}</span>
        </div>
      )}
    </>
  );
}

function EditFields({
  draft,
  updateDraft,
}: {
  draft: FoodRecord;
  updateDraft: <Key extends keyof FoodRecord>(
    key: Key,
    value: FoodRecord[Key]
  ) => void;
}) {
  return (
    <div className="mb-5">
      <TextField
        label="餐厅名称"
        value={draft.restaurantName}
        onChange={(value) => updateDraft("restaurantName", value)}
      />
      <TextField
        label="餐厅地址"
        value={draft.restaurantAddress ?? ""}
        onChange={(value) => updateDraft("restaurantAddress", value)}
      />
      <TextField
        label="菜系标签"
        value={draft.cuisineTags.join("、")}
        onChange={(value) =>
          updateDraft(
            "cuisineTags",
            value
              .split(/[、,，]/)
              .map((tag) => tag.trim())
              .filter(Boolean)
          )
        }
      />
      <div className="mb-4">
        <label className="mb-2 block text-sm text-muted">总体评分</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => updateDraft("overallRating", star)}
              className="min-h-10 min-w-10"
              aria-label={`${star} 星`}
            >
              <Star
                className={`size-6 ${
                  star <= (draft.overallRating ?? 0)
                    ? "fill-warning text-warning"
                    : "text-border"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-1.5 block text-sm text-muted">品鉴笔记</label>
        <textarea
          value={draft.tastingNotes ?? ""}
          onChange={(event) => updateDraft("tastingNotes", event.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-charcoal outline-none focus:border-primary"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1.5 block text-sm text-muted">人均消费</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
            ¥
          </span>
          <input
            type="number"
            value={draft.costPerPerson ?? ""}
            onChange={(event) =>
              updateDraft(
                "costPerPerson",
                event.target.value ? Number(event.target.value) : undefined
              )
            }
            className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 text-charcoal outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm text-muted">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-charcoal outline-none focus:border-primary"
      />
    </div>
  );
}
