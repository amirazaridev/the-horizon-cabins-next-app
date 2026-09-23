/**
 * داده‌های فرضی مقصد برای جستجوی هیرو.
 * بعداً با خروجی getCities (ای‌پی‌آی) جایگزین می‌شود.
 */
export type SearchCity = {
  id: number;
  name: string;
  hint?: string;
};

export const SEARCH_CITIES: SearchCity[] = [
  { id: 1, name: "تهران", hint: "پایتخت" },
  { id: 2, name: "گیلان", hint: "استان" },
  { id: 3, name: "رشت", hint: "مرکز گیلان" },
  { id: 4, name: "مازندران", hint: "استان" },
  { id: 5, name: "اصفهان", hint: "مرکز ایران" },
  { id: 6, name: "کردستان", hint: "غرب کشور" },
  { id: 7, name: "یزد", hint: "کویر" },
  { id: 8, name: "هرمزگان", hint: "ساحل جنوب" },
];
