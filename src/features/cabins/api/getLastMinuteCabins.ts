import { apiFetch } from "@/libs/api/apiFetch";
import { type ApiResponse } from "@/types/api-response";
import { HORIZON_TIMEZONE } from "@/libs/utils/tehran-date";
import {
  type LastMinuteCabin,
  type LastMinuteCabinDto,
} from "../types/cabin.types";
import { mapCabin } from "../utils/mapCabin";

/** آفست ثابت تهران (+۰۳:۳۰). ایران از ۲۰۲۲ ساعت تابستانی ندارد. */
const TEHRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000;

const LAST_MINUTE_MAX_CACHE_SECONDS = 300;

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
      revalidate: Math.min(
        secondsUntilWindowEnd(),
        LAST_MINUTE_MAX_CACHE_SECONDS,
      ),
      tags: ["last-minute-data"],
    },
  });

  const json: ApiResponse<"cabins", LastMinuteCabinDto[]> = await res.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Failed to fetch last-minute cabins");
  }

  return (json.data.cabins ?? []).map(mapLastMinute);
}
