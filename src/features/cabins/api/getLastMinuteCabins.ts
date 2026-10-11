import { apiFetch } from "@/libs/api/apiFetch";
import { ApiResponse } from "@/types/api-response";
import { HORIZON_TIMEZONE } from "@/libs/utils/tehran-date";
import {
  LastMinuteCabin,
  LastMinuteCabinDto,
} from "../types/cabin.types";
import { mapCabin } from "../utils/mapCabin";

/**
 * پیشنهادهای «تخفیف لحظه‌آخری» — تخفیف‌هایی که امروز یا فردا منقضی می‌شوند.
 *
 * `limit` از سمت Next قابل تنظیم است (پیش‌فرض ۵).
 *
 * ### استراتژی کش
 * پنجره‌ی بک‌اند `[today, today+1]` (به وقت تهران) است؛ پس `revalidate` را
 * دقیقاً تا «پایان فردا» تنظیم می‌کنیم تا با چرخش پنجره، داده‌ی تازه بیاید.
 * علاوه بر آن، تگ `last-minute-data` اجازه می‌دهد وقتی تایمر سمت کلاینت به
 * صفر رسید، داده فوراً باطل شود (Server Action `revalidateLastMinute`).
 */

/** آفست ثابت تهران (+۰۳:۳۰). ایران از ۲۰۲۲ ساعت تابستانی ندارد. */
const TEHRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000;

/** ثانیه‌های باقی‌مانده تا پایان پنجره (شروع «پس‌فردا» به وقت تهران). */
function secondsUntilWindowEnd(now: Date = new Date()): number {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: HORIZON_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [year, month, day] = ymd.split("-").map(Number);

  const windowEnd = new Date(Date.UTC(year, month - 1, day + 2) - TEHRAN_OFFSET_MS);
  const seconds = Math.floor((windowEnd.getTime() - now.getTime()) / 1000);
  //* کف ۶۰ ثانیه تا از revalidate صفر/منفی جلوگیری شود.
  return Math.max(60, seconds);
}

function mapLastMinute(dto: LastMinuteCabinDto): LastMinuteCabin {
  return {
    ...mapCabin(dto),
    finalPrice: dto.finalPrice,
    originalPrice: dto.originalPrice,
    discountPercent: dto.discountPercent,
    expiresAt: dto.expiresAt,
  };
}

export async function getLastMinuteCabins(limit = 5): Promise<LastMinuteCabin[]> {
  const res = await apiFetch(`cabins/last-minute?limit=${limit}`, {
    cache: "force-cache",
    next: {
      revalidate: secondsUntilWindowEnd(),
      tags: ["last-minute-data"],
    },
  });

  const json: ApiResponse<"cabins", LastMinuteCabinDto[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch last-minute cabins");
  }

  return (json.data.cabins ?? []).map(mapLastMinute);
}
