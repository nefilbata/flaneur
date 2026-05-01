"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, MapPin, Minus, Plus, Star, X } from "lucide-react";
import { CUISINE_TAGS } from "@/types/food-record";

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSave?: (data: RecordFormData) => void;
}

export interface RecordFormData {
  dishName: string;
  restaurantName: string;
  restaurantAddress: string;
  cuisineTags: string[];
  overallRating: number;
  flavor: {
    umami: number;
    spicy: number;
    sweet: number;
    aromatic: number;
    sour: number;
    rich: number;
  };
  tastingNotes: string;
  costPerPerson: string;
  recordDate: string;
  photos: File[];
}

const FLAVOR_LABELS = [
  { key: "umami", label: "鲜", emoji: "🍣" },
  { key: "spicy", label: "辣", emoji: "🌶️" },
  { key: "sweet", label: "甜", emoji: "🍰" },
  { key: "aromatic", label: "香", emoji: "🌿" },
  { key: "sour", label: "酸", emoji: "🍋" },
  { key: "rich", label: "浓", emoji: "🥘" },
] as const;

type FlavorKey = (typeof FLAVOR_LABELS)[number]["key"];

export function RecordModal({ isOpen, onClose, selectedDate, onSave }: RecordModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [dishName, setDishName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [flavor, setFlavor] = useState({
    umami: 0,
    spicy: 0,
    sweet: 0,
    aromatic: 0,
    sour: 0,
    rich: 0,
  });
  const [tastingNotes, setTastingNotes] = useState("");
  const [costPerPerson, setCostPerPerson] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  const resetForm = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    setPhotos([]);
    setDishName("");
    setRestaurantName("");
    setRestaurantAddress("");
    setSelectedTags([]);
    setRating(0);
    setFlavor({ umami: 0, spicy: 0, sweet: 0, aromatic: 0, sour: 0, rich: 0 });
    setTastingNotes("");
    setCostPerPerson("");
    setShowAllTags(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((current) => [...current, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].preview);
      return current.filter((_, photoIndex) => photoIndex !== index);
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const updateFlavor = (key: FlavorKey, delta: number) => {
    setFlavor((current) => ({
      ...current,
      [key]: Math.max(0, Math.min(5, current[key] + delta)),
    }));
  };

  const handleSave = () => {
    if (!dishName.trim() || !restaurantName.trim()) return;
    onSave?.({
      dishName,
      restaurantName,
      restaurantAddress,
      cuisineTags: selectedTags,
      overallRating: rating,
      flavor,
      tastingNotes,
      costPerPerson,
      recordDate: selectedDate,
      photos: photos.map((photo) => photo.file),
    });
    resetForm();
    onClose();
  };

  const displayTags = showAllTags ? CUISINE_TAGS : CUISINE_TAGS.slice(0, 12);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-charcoal/30 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: "100%", opacity: 0.96 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[88vh] overflow-y-auto rounded-t-3xl bg-surface shadow-[0_-8px_40px_rgba(44,44,44,0.12)] md:bottom-auto md:left-1/2 md:right-auto md:top-28 md:max-h-[calc(100vh-9rem)] md:w-[min(680px,calc(100vw-4rem))] md:-translate-x-1/2 md:rounded-3xl md:shadow-[0_20px_70px_rgba(44,44,44,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 rounded-t-3xl bg-surface pb-2 pt-3">
              <div className="mx-auto h-1 w-10 rounded-full bg-border" />
            </div>

            <div className="px-6 pb-8 md:px-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl text-charcoal">记录美食</h3>
                  <p className="mt-0.5 text-xs text-muted">{selectedDate}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="ml-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-soft transition-colors hover:bg-border"
                  aria-label="关闭表单"
                >
                  <X className="size-5 text-muted" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.preview}
                      className="relative size-24 flex-shrink-0 overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={photo.preview}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-charcoal/55"
                        aria-label="移除照片"
                      >
                        <X className="size-3 text-surface" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 rounded-full bg-primary-strong px-1.5 py-0.5 text-[10px] text-surface">
                          封面
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex size-24 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-border transition-colors hover:border-primary/50"
                  >
                    <Camera className="size-5 text-muted" />
                    <span className="text-[11px] text-muted">添加照片</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <TextField
                label="菜品名称 *"
                value={dishName}
                onChange={setDishName}
                placeholder="今天吃了什么？"
              />
              <TextField
                label="餐厅名称 *"
                value={restaurantName}
                onChange={setRestaurantName}
                placeholder="在哪家店吃的？"
                icon={<MapPin className="mr-1 inline-block size-3.5 -translate-y-0.5" />}
              />
              <TextField
                label="餐厅地址"
                value={restaurantAddress}
                onChange={setRestaurantAddress}
                placeholder="地址，选填"
              />

              <div className="mb-5">
                <label className="mb-2 block text-sm text-muted">菜系</label>
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? "bg-primary-strong text-surface shadow-sm"
                          : "bg-soft text-muted hover:bg-border"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="rounded-full bg-soft px-3 py-1.5 text-sm text-muted transition-colors hover:bg-border"
                  >
                    {showAllTags ? "收起" : `更多 +${CUISINE_TAGS.length - 12}`}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm text-muted">总体评分</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileTap={{ scale: 1.18 }}
                      onClick={() => setRating(star === rating ? 0 : star)}
                      className="min-h-11 min-w-11 transition-colors"
                      aria-label={`${star} 星`}
                    >
                      <Star
                        className={`size-7 transition-colors duration-200 ${
                          star <= rating
                            ? "fill-warning text-warning"
                            : "text-border hover:text-warning/50"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-3 block text-sm text-muted">风味评分</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FLAVOR_LABELS.map(({ key, label, emoji }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">
                        {emoji} {label}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateFlavor(key, -1)}
                          className="flex size-8 items-center justify-center rounded-full bg-soft transition-colors hover:bg-border"
                          aria-label={`${label}减一分`}
                        >
                          <Minus className="size-3 text-muted" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium text-charcoal">
                          {flavor[key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateFlavor(key, 1)}
                          className="flex size-8 items-center justify-center rounded-full bg-soft transition-colors hover:bg-border"
                          aria-label={`${label}加一分`}
                        >
                          <Plus className="size-3 text-muted" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-1.5 block text-sm text-muted">品鉴笔记</label>
                <textarea
                  value={tastingNotes}
                  onChange={(event) => setTastingNotes(event.target.value)}
                  placeholder="记录你的味觉感受..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-charcoal transition-all placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="mb-8">
                <label className="mb-1.5 block text-sm text-muted">人均消费</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                    ¥
                  </span>
                  <input
                    type="number"
                    value={costPerPerson}
                    onChange={(event) => setCostPerPerson(event.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 text-charcoal transition-all placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!dishName.trim() || !restaurantName.trim()}
                className="w-full rounded-2xl bg-primary-strong py-3.5 font-medium text-surface shadow-sm transition-all duration-200 hover:bg-primary-strong/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                保存记录
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm text-muted">
        {icon}
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-charcoal transition-all placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
