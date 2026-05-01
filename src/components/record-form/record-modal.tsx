"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, MapPin, Minus, Plus, Star, X } from "lucide-react";
import { generateSticker } from "@/lib/sticker-generator";
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
  stickerUrl?: string;
}

const FLAVOR_LABELS = [
  { key: "umami", label: "\u9c9c", emoji: "\ud83c\udf63" },
  { key: "spicy", label: "\u8fa3", emoji: "\ud83c\udf36\ufe0f" },
  { key: "sweet", label: "\u751c", emoji: "\ud83c\udf70" },
  { key: "aromatic", label: "\u9999", emoji: "\ud83c\udf3f" },
  { key: "sour", label: "\u9178", emoji: "\ud83c\udf4b" },
  { key: "rich", label: "\u6d53", emoji: "\ud83e\udd58" },
] as const;

type FlavorKey = (typeof FLAVOR_LABELS)[number]["key"];
type LocalPhoto = { file: File; preview: string; stickerUrl?: string };

export function RecordModal({ isOpen, onClose, selectedDate, onSave }: RecordModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPhotos = await Promise.all(
      files.map(async (file) => {
        const preview = URL.createObjectURL(file);
        try {
          return { file, preview, stickerUrl: await generateSticker(file) };
        } catch {
          return { file, preview };
        }
      })
    );
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
      stickerUrl: photos[0]?.stickerUrl,
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
                  <h3 className="font-serif text-xl text-charcoal">{"\u8bb0\u5f55\u7f8e\u98df"}</h3>
                  <p className="mt-0.5 text-xs text-muted">{selectedDate}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="ml-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-soft transition-colors hover:bg-border"
                  aria-label="Close form"
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
                        src={photo.stickerUrl ?? photo.preview}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-charcoal/55"
                        aria-label="Remove photo"
                      >
                        <X className="size-3 text-surface" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 rounded-full bg-primary-strong px-1.5 py-0.5 text-[10px] text-surface">
                          {"\u5c01\u9762"}
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
                    <span className="text-[11px] text-muted">{"\u6dfb\u52a0\u7167\u7247"}</span>
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
                label={"\u83dc\u54c1\u540d\u79f0 *"}
                value={dishName}
                onChange={setDishName}
                placeholder={"\u4eca\u5929\u5403\u4e86\u4ec0\u4e48\uff1f"}
              />
              <TextField
                label={"\u9910\u5385\u540d\u79f0 *"}
                value={restaurantName}
                onChange={setRestaurantName}
                placeholder={"\u5728\u54ea\u5bb6\u5e97\u5403\u7684\uff1f"}
                icon={<MapPin className="mr-1 inline-block size-3.5 -translate-y-0.5" />}
              />
              <TextField
                label={"\u9910\u5385\u5730\u5740"}
                value={restaurantAddress}
                onChange={setRestaurantAddress}
                placeholder={"\u5730\u5740\uff0c\u9009\u586b"}
              />

              <div className="mb-5">
                <label className="mb-2 block text-sm text-muted">{"\u83dc\u7cfb"}</label>
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
                    {showAllTags ? "\u6536\u8d77" : `\u66f4\u591a +${CUISINE_TAGS.length - 12}`}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm text-muted">{"\u603b\u4f53\u8bc4\u5206"}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileTap={{ scale: 1.18 }}
                      onClick={() => setRating(star === rating ? 0 : star)}
                      className="min-h-11 min-w-11 transition-colors"
                      aria-label={`${star} stars`}
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
                <label className="mb-3 block text-sm text-muted">{"\u98ce\u5473\u8bc4\u5206"}</label>
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
                          aria-label={`${label} minus one`}
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
                          aria-label={`${label} plus one`}
                        >
                          <Plus className="size-3 text-muted" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-1.5 block text-sm text-muted">{"\u54c1\u9274\u7b14\u8bb0"}</label>
                <textarea
                  value={tastingNotes}
                  onChange={(event) => setTastingNotes(event.target.value)}
                  placeholder={"\u8bb0\u5f55\u4f60\u7684\u5473\u89c9\u611f\u53d7..."}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-charcoal transition-all placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="mb-8">
                <label className="mb-1.5 block text-sm text-muted">{"\u4eba\u5747\u6d88\u8d39"}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                    {"\u00a5"}
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
                {"\u4fdd\u5b58\u8bb0\u5f55"}
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
