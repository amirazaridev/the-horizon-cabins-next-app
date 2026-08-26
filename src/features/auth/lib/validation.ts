export function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (digit) =>
    String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
  );
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "ایمیل الزامی است";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "فرمت ایمیل صحیح نیست";
  return undefined;
}

export function validatePassword(
  value: string,
  minLength = 8,
): string | undefined {
  if (!value) return "رمز عبور الزامی است";
  if (value.length < minLength)
    return `رمز عبور باید حداقل ${minLength} کاراکتر باشد`;
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const normalized = normalizeDigits(value.trim());
  if (!normalized) return "شماره موبایل الزامی است";
  if (!/^09\d{9}$/.test(normalized))
    return "شماره موبایل معتبر نیست (مثال: 09123456789)";
  return undefined;
}

export type PasswordStrength = {
  score: number;
  label: string;
};

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z\d]/.test(password)) score += 1;

  const labels = ["خیلی ضعیف", "ضعیف", "متوسط", "خوب", "عالی"];
  return { score, label: labels[score] };
}
