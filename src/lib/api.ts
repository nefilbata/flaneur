import { supabase } from "@/lib/supabase";
import type { Achievement, FoodRecord, NewFoodRecord } from "@/types/food-record";

type FoodRecordRow = {
  id: string;
  user_id: string | null;
  dish_name: string;
  restaurant_name: string;
  restaurant_address: string | null;
  latitude: number | null;
  longitude: number | null;
  cuisine_tags: string[] | null;
  overall_rating: number | null;
  flavor_umami: number | null;
  flavor_spicy: number | null;
  flavor_sweet: number | null;
  flavor_aromatic: number | null;
  flavor_sour: number | null;
  flavor_rich: number | null;
  tasting_notes: string | null;
  cost_per_person: number | null;
  record_date: string;
  created_at: string;
  food_photos?: FoodPhotoRow[];
};

type FoodPhotoRow = {
  id: string;
  photo_url: string;
  is_cover: boolean;
  sort_order: number;
};

type AchievementRow = {
  id: string;
  user_id: string | null;
  achievement_key: string;
  achievement_name: string;
  description: string | null;
  unlocked_at: string;
  is_scratched: boolean;
};

function mapRecord(row: FoodRecordRow): FoodRecord {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    dishName: row.dish_name,
    restaurantName: row.restaurant_name,
    restaurantAddress: row.restaurant_address ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    cuisineTags: row.cuisine_tags ?? [],
    overallRating: row.overall_rating ?? undefined,
    flavor: {
      umami: row.flavor_umami ?? 0,
      spicy: row.flavor_spicy ?? 0,
      sweet: row.flavor_sweet ?? 0,
      aromatic: row.flavor_aromatic ?? 0,
      sour: row.flavor_sour ?? 0,
      rich: row.flavor_rich ?? 0,
    },
    tastingNotes: row.tasting_notes ?? undefined,
    costPerPerson: row.cost_per_person ?? undefined,
    photos:
      row.food_photos?.map((photo) => ({
        id: photo.id,
        url: photo.photo_url,
        isCover: photo.is_cover,
        sortOrder: photo.sort_order,
      })) ?? [],
    recordDate: row.record_date,
    createdAt: row.created_at,
  };
}

function mapAchievement(row: AchievementRow): Achievement {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    key: row.achievement_key,
    name: row.achievement_name,
    description: row.description ?? "",
    unlockedAt: row.unlocked_at,
    isScratched: row.is_scratched,
  };
}

export async function getRecordsByMonth(
  year: number,
  month: number
): Promise<FoodRecord[]> {
  if (!supabase) return [];

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("food_records")
    .select("*, food_photos(*)")
    .gte("record_date", startDate)
    .lte("record_date", endDate)
    .order("record_date", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as FoodRecordRow[]).map(mapRecord);
}

export async function createRecord(data: NewFoodRecord): Promise<FoodRecord> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const flavor = data.flavor ?? {};
  const { data: insertedRecord, error } = await supabase
    .from("food_records")
    .insert({
      user_id: data.userId,
      dish_name: data.dishName,
      restaurant_name: data.restaurantName,
      restaurant_address: data.restaurantAddress,
      latitude: data.latitude,
      longitude: data.longitude,
      cuisine_tags: data.cuisineTags ?? [],
      overall_rating: data.overallRating,
      flavor_umami: flavor.umami ?? 0,
      flavor_spicy: flavor.spicy ?? 0,
      flavor_sweet: flavor.sweet ?? 0,
      flavor_aromatic: flavor.aromatic ?? 0,
      flavor_sour: flavor.sour ?? 0,
      flavor_rich: flavor.rich ?? 0,
      tasting_notes: data.tastingNotes,
      cost_per_person: data.costPerPerson,
      record_date: data.recordDate,
    })
    .select()
    .single();

  if (error) throw error;

  const photoUrls = data.photoUrls ?? [];
  if (photoUrls.length > 0) {
    const { error: photoError } = await supabase.from("food_photos").insert(
      photoUrls.map((url, index) => ({
        record_id: insertedRecord.id,
        photo_url: url,
        is_cover: index === 0,
        sort_order: index,
      }))
    );

    if (photoError) throw photoError;
  }

  const records = await getRecordsByMonth(
    Number(data.recordDate.slice(0, 4)),
    Number(data.recordDate.slice(5, 7))
  );
  return records.find((record) => record.id === insertedRecord.id) ?? mapRecord(insertedRecord);
}

export async function uploadPhoto(file: File): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("food-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("food-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("unlocked_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as AchievementRow[]).map(mapAchievement);
}

export async function unlockAchievement(
  key: string,
  name: string,
  description = ""
): Promise<Achievement> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("achievements")
    .upsert(
      {
        achievement_key: key,
        achievement_name: name,
        description,
      },
      { onConflict: "user_id,achievement_key" }
    )
    .select()
    .single();

  if (error) throw error;
  return mapAchievement(data as AchievementRow);
}
