import type { AccountGender } from "../schemas/account.schema";

export type GuestAccountProfile = {
  /** ایمیل حساب — از سشن؛ قابل ویرایش نیست. */
  email: string;
  fullName: string;
  /** جنسیت؛ `""` یعنی ثبت‌نشده (در بک‌اند `null`). */
  gender: AccountGender;
  phoneNumber: string;
  nationalId: string;
  /** تاریخ تولد به‌شکل `YYYY-MM-DD` — خالی اگر ثبت نشده باشد. */
  dateOfBirth: string;
};
