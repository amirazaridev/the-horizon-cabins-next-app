//* محدوده‌های عددی جستجو — مقادیر زمان‌اجرا (نه تایپ).
//* ⚠️ عمداً در `constants` است نه `types`: فایل تایپ‌ها باید بدون خروجی زمان‌اجرا بماند تا `import type` واقعاً از باندل حذف شود.

//* تعداد مهمان
export const GUESTS_MIN = 1;
export const GUESTS_MAX = 10;

//* محدوده‌ی اسلایدر بودجه (هم‌محدوده با فیلتر قیمت قبلی)
export const BUDGET_MIN = 1_000_000;
export const BUDGET_MAX = 30_000_000;
export const BUDGET_STEP = 100_000;

//* حداکثر تعداد کارت در پیش‌نمایش جستجو
export const SEARCH_PREVIEW_LIMIT = 6;

//* تعداد میلی‌ثانیه در یک شبانه‌روز — برای تبدیل فاصله‌ی دو تاریخ به «تعداد شب».
export const MS_PER_DAY = 86_400_000;
