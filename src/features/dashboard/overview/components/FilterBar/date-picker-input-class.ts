/**
 * کلاس مشترک فیلد ورودی تقویم‌های داشبورد.
 *
 * چرا اینجاست و نه داخل هر کامپوننت؟ این رشته دقیقاً یکسان در
 * `DayRangePicker` و `MonthRangePicker` تکرار شده بود؛ با استخراجش، تغییر
 * ظاهر فیلد در یک جا انجام می‌شود.
 *
 * ⚠️ همه‌ی کلاس‌ها `!` دارند چون `react-multi-date-picker` روی خودِ
 * `<input>` استایل تزریقی با رنگ‌های هاردکد می‌گذارد
 * (`border: #c0c4d6`، و روی فوکوس `border/box-shadow: #a4b3c5`).
 * `!shadow-none` همان سایه‌ی فوکوس آبی را خنثی می‌کند و نشانگر فوکوس از
 * تغییر رنگ قاب می‌آید — یعنی همه‌چیز از توکن‌های تم.
 */
export const DATE_PICKER_INPUT_CLASS =
  "!w-full !h-11 !rounded-xl !border !border-border !bg-background !px-3 !text-sm !text-text !shadow-none text-center focus:!border-primary-400";
