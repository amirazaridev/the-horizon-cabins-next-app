"use server";

import { updateTag } from "next/cache";

/**
 * ابطال کش پیشنهادهای «تخفیف لحظه‌آخری».
 *
 * وقتی تایمر سمت کلاینت به صفر می‌رسد (یعنی نزدیک‌ترین تخفیف منقضی شد)
 * این Server Action صدا زده می‌شود تا داده‌ی تازه از API گرفته شود و
 * تخفیف‌های منقضی‌شده از سکشن حذف شوند.
 *
 * ⚠️ در Next 16 داخل Server Action از `updateTag` استفاده می‌کنیم (نه
 * `revalidateTag`) تا معنای read-your-own-writes فوراً برقرار شود.
 */
export async function revalidateLastMinute(): Promise<void> {
  updateTag("last-minute-data");
}
