import type { ReactNode } from "react";
import { Info } from "lucide-react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import { SETTING_GROUPS, formatSettingValue } from "../constants/settings-fields";
import type { AppSettings } from "../types/settings.types";

/**
 * نمایش **فقط‌خواندنی** تنظیمات سامانه.
 *
 * ⚠️ فرم ویرایش در فاز بعد اضافه می‌شود (ویرایش سمت بک‌اند فقط برای owner
 * مجاز است)؛ این صفحه فعلاً مقدار مؤثر هر تنظیم را نشان می‌دهد.
 */
export default function SettingsView({ settings }: { settings: AppSettings }): ReactNode {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-border bg-background-2/60 text-text-gray flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs leading-relaxed">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          این صفحه مقادیر <b className="text-text">مؤثر فعلی</b> سامانه را نشان می‌دهد.
          ویرایش تنظیمات فقط برای <b className="text-text">مالک</b> مجاز است.
        </span>
      </div>

      {SETTING_GROUPS.map((group) => (
        <CardDashContainer key={group.id} className="p-5">
          <header className="mb-4 flex items-center gap-2.5">
            <span className="bg-primary-400/10 text-primary-500 grid size-9 shrink-0 place-items-center rounded-xl">
              <group.icon className="size-4.5" aria-hidden="true" />
            </span>
            <h3 className="text-text text-base font-bold">{group.title}</h3>
          </header>

          <dl className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className="border-border/60 flex items-center justify-between gap-3 border-b py-2.5 last:border-0"
              >
                <dt className="text-text-gray text-sm">{field.label}</dt>
                <dd className="text-text text-sm font-semibold tabular-nums">
                  {formatSettingValue(settings[field.key], field.unit)}
                </dd>
              </div>
            ))}
          </dl>
        </CardDashContainer>
      ))}
    </div>
  );
}
