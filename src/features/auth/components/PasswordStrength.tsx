"use client";

import { Check, X } from "lucide-react";
import {
  getPasswordStrength,
  PASSWORD_RULES,
  type PasswordRuleId,
} from "../schemas/auth.schema";

type Props = {
  password: string;
  /** نمایش چک‌لیست قواعد — پیش‌فرض روشن. */
  showRules?: boolean;
  className?: string;
};

/**
 * رنگ هر سطح قدرت. کلید = امتیاز (۰..۴).
 * ⚠️ رنگ «خوب/عالی» سبز است نه قرمز؛ در این UI سبز = معتبر، مستقل از
 * قرارداد رنگ بازار سرمایه که فقط به نمودارهای قیمت مربوط است.
 */
const LEVEL_STYLES = [
  { bar: "bg-danger-strong", text: "text-danger", glow: "shadow-danger-strong/30" },
  { bar: "bg-orange-500", text: "text-orange-500", glow: "shadow-orange-500/30" },
  { bar: "bg-yellow-500", text: "text-yellow-600", glow: "shadow-yellow-500/30" },
  { bar: "bg-lime-500", text: "text-lime-600", glow: "shadow-lime-500/30" },
  { bar: "bg-emerald-500", text: "text-emerald-600", glow: "shadow-emerald-500/30" },
] as const;

const RULE_LABELS: Record<PasswordRuleId, string> = {
  length: "حداقل ۸ کاراکتر",
  case: "حرف بزرگ و کوچک انگلیسی",
  digit: "حداقل یک عدد",
  special: "حداقل یک کاراکتر ویژه",
};

/**
 * نشانگر قدرت رمز عبور.
 *
 * دو لایه بازخورد می‌دهد:
 *  1. نوار چهاربخشی + برچسب کلامی (خیلی ضعیف … عالی).
 *  2. چک‌لیست قواعد با علامت ✓/✗ — کاربر دقیقاً می‌داند چه کم است،
 *     به‌جای حدس‌زدن از روی رنگ.
 *
 * همه‌ی قواعد از `PASSWORD_RULES` می‌آیند؛ همان تعریفی که اسکیمای zod
 * استفاده می‌کند. پس هرگز بین «چه می‌گوید» و «چه اجازه می‌دهد» فاصله نمی‌افتد.
 */
export default function PasswordStrength({
  password,
  showRules = true,
  className = "",
}: Props) {
  const strength = getPasswordStrength(password);
  const level = LEVEL_STYLES[strength.score];
  const hasInput = password.length > 0;

  return (
    <div className={className} aria-live="polite">
      <div className="flex gap-1.5" role="presentation">
        {[0, 1, 2, 3].map((index) => {
          const isActive = hasInput && index < strength.score;
          return (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                isActive
                  ? `${level.bar} shadow-sm ${level.glow}`
                  : "bg-foreground/10"
              }`}
            />
          );
        })}
      </div>

      <p className="text-text/45 mt-2 text-xs">
        قدرت رمز عبور:{" "}
        <span className={`font-semibold ${hasInput ? level.text : "text-text/40"}`}>
          {hasInput ? strength.label : "—"}
        </span>
      </p>

      {showRules && (
        <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {PASSWORD_RULES.map((rule) => {
            const passed = hasInput && !strength.unmet.includes(rule.id);
            return (
              <li
                key={rule.id}
                className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${
                  passed
                    ? "text-emerald-600"
                    : hasInput
                      ? "text-text/45"
                      : "text-text/35"
                }`}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    passed ? "bg-emerald-500/15" : "bg-foreground/8"
                  }`}
                  aria-hidden="true"
                >
                  {passed ? (
                    <Check className="size-3" />
                  ) : (
                    <X className="size-2.5" />
                  )}
                </span>
                {RULE_LABELS[rule.id]}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
