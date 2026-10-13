export interface GaugeRange {
  start: number;
  end: number;
}

export interface GaugeTick {
  key: string;
  label: string;
  position: number;
}

export type CommitMode = "change" | "apply";

/** دستگیرهٔ در حال کشیدن: `start` = مقدار کمینه، `end` = مقدار بیشینه. */
export type DragHandle = "start" | "end";

export interface RangeGaugeApi {
  /** مقادیر تأییدشدهٔ فعلی (برای دکمهٔ «اعمال») */
  getRange: () => GaugeRange;
  /** اعمال بازهٔ فعلی روی onCommit */
  submit: () => void;
  /** برگرداندن اسلایدر به محدودهٔ کامل */
  reset: () => void;
}

export interface RangeGaugeProps {
  /** حد پائین بازه (مقدار واقعی، نه آفست) */
  minValue: number;
  /** حد بالای بازه (مقدار واقعی، نه آفست) */
  maxValue: number;
  /** مقدار انتخاب‌شدهٔ فعلی؛ اگر ندهید، محدودهٔ کامل در نظر گرفته می‌شود */
  value?: GaugeRange | null;
  /** گام حرکت اسلایدر و دکمه‌های جهت‌دار */
  step?: number;
  /** فاصلهٔ حداقل بین دو دستگیره (پیش‌فرض: یک step) */
  minGap?: number;
  formatValue: (value: number) => string;
  startAriaLabel: string;
  endAriaLabel: string;
  /**
   * خروجی گرفتن از بازهٔ انتخاب‌شده:
   * - `change` => با هر رها کردن موس / تغییر دستگیره (رفتار زندهٔ قبلی)
   * - `apply`  => فقط وقتی مصرف‌کننده `submit()` را صدا بزند یا روی دکمهٔ اعمال بزند
   */
  onCommit: (range: GaugeRange) => void;
  /** `change` (پیش‌فرض) یا `apply` */
  commitOn?: CommitMode;
  /** برای `commitOn="apply"` — تابع submit را به مصرف‌کننده می‌دهد */
  onReady?: (api: RangeGaugeApi) => void;
  ticks?: GaugeTick[];
  showInputs?: boolean;
}
