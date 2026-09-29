/**
 * ذخیره‌ی «آخرین جستجو» در localStorage.
 *
 * ⚠️ عمداً روی خودِ استور Zustand `persist()` نگذاشته‌ایم؛ استور باید
 * فقط «تداوم ناوبری در حافظه» بماند. این ماژول یک اسنپ‌شاتِ مستقل و
 * نسخه‌دار از آخرین جستجو نگه می‌دارد.
 *
 * چرا «query string» ذخیره می‌شود و نه شیء فیلتر؟
 *  - همان قرارداد URL است، پس با `parseSearchFilters` خوانده می‌شود و
 *    منطق سریال‌سازی دوباره نوشته نمی‌شود.
 *  - فشرده، قابل‌خواندن و مقاوم در برابر تغییر شکل مدل است.
 *
 * این ماژول به‌صورت یک «استور خارجی» رفتار می‌کند (subscribe/getSnapshot)
 * تا کامپوننت‌ها بتوانند با `useSyncExternalStore` آن را بخوانند — بدون
 * effect و بدون setState درون effect.
 */

const STORAGE_KEY = "horizon:last-search";
const STORAGE_VERSION = 1;

type StoredLastSearch = {
  version: number;
  savedAt: string;
  query: string;
};

const listeners = new Set<() => void>();

/**
 * کشِ آخرین مقدار خوانده‌شده.
 * `undefined` یعنی «هنوز خوانده نشده»، `null` یعنی «خوانده شد و خالی بود».
 * بدون این کش، `getSnapshot` در هر رندر `JSON.parse` می‌زد.
 */
let cachedQuery: string | null | undefined;

function readFromStorage(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredLastSearch>;

    if (parsed.version !== STORAGE_VERSION) return null;
    if (typeof parsed.query !== "string" || !parsed.query.trim()) return null;

    return parsed.query;
  } catch {
    return null;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

/* ------------------------------------------------------------------ */
/* قرارداد استور خارجی                                                */
/* ------------------------------------------------------------------ */

export function subscribeLastSearch(listener: () => void): () => void {
  listeners.add(listener);

  /** هم‌گام‌سازی بین تب‌ها */
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    cachedQuery = undefined;
    emit();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/** snapshot سمت کلاینت — باید ارزان و پایدار باشد */
export function getLastSearchQuery(): string | null {
  if (cachedQuery === undefined) cachedQuery = readFromStorage();
  return cachedQuery;
}

/** snapshot سمت سرور — همیشه خالی تا رندر سرور و کلاینت یکسان بماند */
export function getServerLastSearchQuery(): string | null {
  return null;
}

/* ------------------------------------------------------------------ */
/* نوشتن                                                              */
/* ------------------------------------------------------------------ */

/** ذخیره‌ی آخرین جستجو؛ مقدار خالی یا تکراری نادیده گرفته می‌شود */
export function saveLastSearchQuery(query: string): void {
  if (typeof window === "undefined") return;

  const normalized = query.trim();
  if (!normalized || normalized === cachedQuery) return;

  try {
    const payload: StoredLastSearch = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      query: normalized,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    cachedQuery = normalized;
    emit();
  } catch {
    // حالت private یا پر بودن حافظه — بی‌صدا نادیده گرفته می‌شود
  }
}

export function clearLastSearch(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // بی‌صدا
  }

  cachedQuery = null;
  emit();
}
