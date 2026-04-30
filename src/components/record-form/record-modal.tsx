"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Star, MapPin, Plus, Minus } from "lucide-react";
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

const FLAVOR_LABELS: { key: string; label: string; emoji: string }[] = [
  { key: "umami", label: "鲜", emoji: "🫕" },
  { key: "spicy", label: "辣", emoji: "🌶" },
  { key: "sweet", label: "甜", emoji: "🍯" },
  { key: "aromatic", label: "香", emoji: "🌿" },
  { key: "sour", label: "酸", emoji: "🍋" },
  { key: "rich", label: "浓", emoji: "🧈" },
];

export function RecordModal({ isOpen, onClose, selectedDate, onSave }: RecordModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [dishName, setDishName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [flavor, setFlavor] = useState({
    umami: 0, spicy: 0, sweet: 0, aromatic: 0, sour: 0, rich: 0,
  });
  const [tastingNotes, setTastingNotes] = useState("");
  const [costPerPerson, setCostPerPerson] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const updateFlavor = (key: string, delta: number) => {
    setFlavor((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(5, (prev as Record<string, number>)[key] + delta)),
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
      photos: photos.map((p) => p.file),
    });
    onClose();
  };

  const displayTags = showAllTags ? CUISINE_TAGS : CUISINE_TAGS.slice(0, 12);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* 表单面板 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50
                       bg-surface rounded-t-3xl max-h-[88vh] overflow-y-auto
                       shadow-[0_-8px_40px_rgba(44,44,44,0.12)]"
          >
            {/* 拖动指示条 */}
            <div className="sticky top-0 bg-surface pt-3 pb-2 rounded-t-3xl z-10">
              <div className="w-10 h-1 rounded-full bg-border mx-auto" />
            </div>

            <div className="px-6 pb-8">
              {/* 标题行 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-charcoal">记录美食</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-soft flex items-center justify-center
                             hover:bg-border transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>

              {/* ── 图片上传 ── */}
              <div className="mb-6">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden">
                      <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50
                                   flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-[10px] bg-primary/90
                                         text-white px-1.5 py-0.5 rounded-full">
                          封面
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed
                               border-border hover:border-primary/50 transition-colors
                               flex flex-col items-center justify-center gap-1"
                  >
                    <Camera className="w-5 h-5 text-muted" />
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

              {/* ── 菜品名称 ── */}
              <div className="mb-5">
                <label className="block text-sm text-muted mb-1.5">菜品名称 *</label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="今天吃了什么？"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border
                             text-charcoal placeholder:text-muted/50
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all"
                />
              </div>

              {/* ── 餐厅名称 ── */}
              <div className="mb-5">
                <label className="block text-sm text-muted mb-1.5">
                  <MapPin className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
                  餐厅名称 *
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="在哪家店吃的？"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border
                             text-charcoal placeholder:text-muted/50
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all"
                />
              </div>

              {/* ── 餐厅地址 ── */}
              <div className="mb-5">
                <label className="block text-sm text-muted mb-1.5">餐厅地址</label>
                <input
                  type="text"
                  value={restaurantAddress}
                  onChange={(e) => setRestaurantAddress(e.target.value)}
                  placeholder="地址（选填）"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border
                             text-charcoal placeholder:text-muted/50
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all"
                />
              </div>

              {/* ── 菜系标签 ── */}
              <div className="mb-5">
                <label className="block text-sm text-muted mb-2">菜系</label>
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200
                        ${selectedTags.includes(tag)
                          ? "bg-primary text-white shadow-sm"
                          : "bg-soft text-muted hover:bg-border"
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="px-3 py-1.5 rounded-full text-sm bg-soft text-muted
                               hover:bg-border transition-colors"
                  >
                    {showAllTags ? "收起" : `更多 +${CUISINE_TAGS.length - 12}`}
                  </button>
                </div>
              </div>

              {/* ── 总体评分 ── */}
              <div className="mb-5">
                <label className="block text-sm text-muted mb-2">总体评分</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 1.3 }}
                      onClick={() => setRating(s === rating ? 0 : s)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors duration-200
                          ${s <= rating
                            ? "fill-warning text-warning"
                            : "text-border hover:text-warning/50"
                          }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ── 风味六维 ── */}
              <div className="mb-5">
                <label className="block text-sm text-muted mb-3">风味评分</label>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {FLAVOR_LABELS.map(({ key, label, emoji }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">
                        {emoji} {label}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateFlavor(key, -1)}
                          className="w-6 h-6 rounded-full bg-soft flex items-center justify-center
                                     hover:bg-border transition-colors"
                        >
                          <Minus className="w-3 h-3 text-muted" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium text-charcoal">
                          {(flavor as Record<string, number>)[key]}
                        </span>
                        <button
                          onClick={() => updateFlavor(key, 1)}
                          className="w-6 h-6 rounded-full bg-soft flex items-center justify-center
                                     hover:bg-border transition-colors"
                        >
                          <Plus className="w-3 h-3 text-muted" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 品鉴笔记 ── */}
              <div className="mb-5">
                <label className="block text-sm text-muted mb-1.5">品鉴笔记</label>
                <textarea
                  value={tastingNotes}
                  onChange={(e) => setTastingNotes(e.target.value)}
                  placeholder="记录你的味觉感受..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border
                             text-charcoal placeholder:text-muted/50 resize-none
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all"
                />
              </div>

              {/* ── 人均消费 ── */}
              <div className="mb-8">
                <label className="block text-sm text-muted mb-1.5">人均消费</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">¥</span>
                  <input
                    type="number"
                    value={costPerPerson}
                    onChange={(e) => setCostPerPerson(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-border
                               text-charcoal placeholder:text-muted/50
                               focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                               transition-all"
                  />
                </div>
              </div>

              {/* ── 保存按钮 ── */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!dishName.trim() || !restaurantName.trim()}
                className="w-full py-3.5 rounded-2xl font-medium text-white
                           bg-primary-strong hover:bg-primary-strong/90
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-sm"
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
