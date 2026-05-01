"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Plus } from "lucide-react";
import { DEMO_RECORDS } from "@/lib/demo-records";
import { generateSticker } from "@/lib/sticker-generator";
import type { FoodRecord } from "@/types/food-record";

type StickerItem = {
  record: FoodRecord;
  url: string;
};

export default function StickersPage() {
  const [stickers, setStickers] = useState<StickerItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function buildStickers() {
      const items = await Promise.all(
        DEMO_RECORDS.map(async (record) => {
          const cover = record.photos.find((photo) => photo.isCover) ?? record.photos[0];
          if (!cover) return null;

          try {
            return { record, url: await generateSticker(cover.url) };
          } catch {
            return { record, url: cover.url };
          }
        })
      );

      if (!cancelled) {
        setStickers(items.filter((item): item is StickerItem => Boolean(item)));
      }
    }

    buildStickers();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-4xl animate-fade-in-up pb-24">
      <header className="mb-8 text-center">
        <p className="text-sm uppercase tracking-widest text-muted">Sticker Album</p>
        <h1 className="mt-2 font-serif text-4xl text-charcoal md:text-5xl">
          {"\u8d34\u7eb8\u518c"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {"\u6bcf\u4e00\u9910\u90fd\u662f\u4e00\u679a\u6536\u85cf"}
        </p>
      </header>

      {stickers.length > 0 ? (
        <div className="grid gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {stickers.map((item, index) => (
            <article key={item.record.id} className="text-center">
              <div
                className="mx-auto w-fit rounded-[30px] bg-surface p-1 shadow-[0_12px_30px_rgba(44,44,44,0.12)] transition duration-300 hover:scale-105 hover:rotate-0"
                style={getStickerStyle(index)}
              >
                <div className="relative size-[210px] overflow-hidden rounded-3xl">
                  <Image
                    src={item.url}
                    alt={item.record.dishName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <p className="mt-4 font-serif text-lg text-charcoal">
                {item.record.dishName}
              </p>
              <p className="text-xs text-muted">{item.record.recordDate}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="card mx-auto max-w-md p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-soft text-primary-strong">
            <Camera className="size-6" />
          </div>
          <p className="mt-4 font-serif text-2xl text-charcoal">
            {"\u8fd8\u6ca1\u6709\u8d34\u7eb8"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {"\u53bb\u8bb0\u5f55\u4e00\u6b21\u7f8e\u98df\u5427"}
          </p>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary-strong px-5 py-3 text-sm font-medium text-surface shadow-sm"
        >
          <Plus className="size-4" />
          {"\u56de\u5230\u9996\u9875\u8bb0\u5f55\u7f8e\u98df"}
        </Link>
      </div>
    </section>
  );
}

function getStickerStyle(index: number) {
  const seed = (index * 7919 + 104729) % 1000;
  const rotate = (seed % 17) - 8;
  const offsetX = (seed % 13) - 6;
  const offsetY = (seed % 11) - 5;

  return {
    transform: `rotate(${rotate}deg) translate(${offsetX}px, ${offsetY}px)`,
  };
}
