"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { CheckCircle2, Info, RotateCcw, Save, TriangleAlert, X } from "lucide-react";

import Button from "@/components/ui/Button";
import CardDashContainer from "@/components/ui/CardDashContainer";
import Input from "@/components/ui/Input";
import { updateSettingsAction } from "../actions/settings.actions";
import {
  formatSettingValue,
  isEditableSetting,
  SETTING_BOUNDS,
  SETTING_GROUPS,
  SETTING_UNIT_SUFFIX,
} from "../constants/settings-fields";
import {
  settingsToDraft,
  toUpdatePayload,
  validateSettingsDraft,
  type SettingsDraft,
} from "../lib/settings-validation";
import type { AppSettings, SettingKey } from "../types/settings.types";

/**
 * فرم ویرایش تنظیمات — فقط برای **owner**.
 *
 * - اعتبارسنجی سمت کلاینت در `lib/settings-validation.ts` (آینه‌ی بک‌اند).
 * - فقط فیلدهای تغییرکرده به `PATCH /settings` فرستاده می‌شوند.
 * - مقادیر مشتق‌شده (گروه «تقویم») فقط‌خواندنی‌اند.
 */
export default function SettingsForm({ settings }: { settings: AppSettings }): ReactNode {
  const [baseline, setBaseline] = useState<AppSettings>(settings);
  const [draft, setDraft] = useState<SettingsDraft>(() => settingsToDraft(settings));
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const validation = useMemo(() => validateSettingsDraft(draft), [draft]);
  const payload = useMemo(() => toUpdatePayload(draft, baseline), [draft, baseline]);

  const changedCount = Object.keys(payload).length;
  const hasErrors = Object.keys(validation.fieldErrors).length > 0;
  const canSubmit = changedCount > 0 && !hasErrors && !isPending;

  const fieldError = (key: SettingKey): string | undefined =>
    serverErrors[key] ?? validation.fieldErrors[key];

  function handleChange(key: SettingKey, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setServerErrors((previous) => {
      if (!(key in previous)) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function handleReset() {
    setDraft(settingsToDraft(baseline));
    setServerErrors({});
    setFeedback(null);
  }

  function handleSubmit() {
    if (!canSubmit) return;

    startTransition(async () => {
      const result = await updateSettingsAction(payload);
      setFeedback({ success: result.success, message: result.message });
      setServerErrors(result.fieldErrors ?? {});

      //* پس از ذخیره، مقدار مرجع فرم را با پاسخ سرور هم‌گام می‌کنیم.
      if (result.success && result.settings) {
        setBaseline(result.settings);
        setDraft(settingsToDraft(result.settings));
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-border bg-background-2/60 text-text-gray flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs leading-relaxed">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          تغییرات فقط پس از زدن «ذخیره تغییرات» اعمال می‌شوند. ویرایش تنظیمات
          تنها برای <b className="text-text">مالک</b> مجاز است.
        </span>
      </div>

      {feedback && (
        <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />
      )}

      {SETTING_GROUPS.map((group) => (
        <CardDashContainer key={group.id} className="p-5">
          <header className="mb-4 flex items-center gap-2.5">
            <span className="bg-primary-400/10 text-primary-500 grid size-9 shrink-0 place-items-center rounded-xl">
              <group.icon className="size-4.5" aria-hidden="true" />
            </span>
            <h3 className="text-text text-base font-bold">{group.title}</h3>
          </header>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {group.fields.map((field) => {
              if (!isEditableSetting(field.key)) {
                return (
                  <ReadOnlyField
                    key={field.key}
                    label={field.label}
                    value={formatSettingValue(baseline[field.key], field.unit)}
                  />
                );
              }

              const bounds = SETTING_BOUNDS[field.key];

              return (
                <Input
                  key={field.key}
                  label={field.label}
                  value={draft[field.key]}
                  onChange={(event) => handleChange(field.key, event.target.value)}
                  inputMode="numeric"
                  autoComplete="off"
                  dir="ltr"
                  inputClassName="text-start tabular-nums"
                  suffix={SETTING_UNIT_SUFFIX[field.unit]}
                  error={fieldError(field.key)}
                  hint={`بازه‌ی مجاز: ${bounds.min.toLocaleString("fa-IR")} تا ${bounds.max.toLocaleString("fa-IR")}`}
                  disabled={isPending}
                />
              );
            })}
          </div>
        </CardDashContainer>
      ))}

      <div className="border-border bg-surface/95 sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 shadow-lg backdrop-blur">
        <span className="text-text-gray text-xs tabular-nums">
          {changedCount > 0
            ? `${changedCount.toLocaleString("fa-IR")} تغییر ذخیره‌نشده`
            : "تغییری اعمال نشده است."}
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            shape="xl"
            onClick={handleReset}
            disabled={changedCount === 0 || isPending}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            بازگردانی
          </Button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-primary-400 focus-visible:ring-primary-400/60 inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden="true" />
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   کمکی‌ها
   ========================================================================== */

/** فیلد مشتق‌شده — قابل ویرایش نیست. */
function ReadOnlyField({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="border-border/60 flex items-center justify-between gap-3 border-b py-2.5">
      <span className="text-text-gray text-sm">{label}</span>
      <span className="text-text text-sm font-semibold tabular-nums" title="مقدار مشتق‌شده — قابل ویرایش نیست">
        {value}
      </span>
    </div>
  );
}

function FeedbackBanner({
  feedback,
  onDismiss,
}: {
  feedback: { success: boolean; message: string };
  onDismiss: () => void;
}): ReactNode {
  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
        feedback.success
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-danger/40 bg-danger/10 text-danger"
      }`}
    >
      <span className="flex items-center gap-2">
        {feedback.success ? (
          <CheckCircle2 className="size-4 shrink-0" />
        ) : (
          <TriangleAlert className="size-4 shrink-0" />
        )}
        {feedback.message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="بستن پیام"
        className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
