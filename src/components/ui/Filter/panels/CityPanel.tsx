"use client";

import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import OptionRow from "../OptionRow";

export type CityPanelOption = {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
};

type CityPanelCommonProps = {
  cities: CityPanelOption[];
  /** نمایش سطر «همه شهرها» (فقط حالت تک‌انتخابی) */
  showAll?: boolean;
  allLabel?: string;
  allHint?: string;
  emptyMessage?: string;
  defaultIcon?: ReactNode;
  className?: string;
};

type CityPanelProps = CityPanelCommonProps &
  (
    | {
        multiple?: false;
        value: string | null;
        onChange: (next: string | null) => void;
      }
    | {
        multiple: true;
        value: string[];
        onChange: (next: string[]) => void;
      }
  );

const DEFAULT_ICON = (
  <MapPin className="text-primary-400 size-4 shrink-0" />
);

/**
 * پنل انتخاب شهر — reusable برای همه‌جا (landing، cabins، dashboard).
 * حالت تکی: مقدار `string | null`؛ حالت چندتایی: مقدار `string[]`.
 * کنترل کامل با والد (داخل FilterCard یا هر جای دیگر).
 */
export default function CityPanel(props: CityPanelProps) {
  const {
    cities,
    showAll = false,
    allLabel = "همه شهرها",
    allHint,
    emptyMessage = "شهری برای نمایش ثبت نشده است.",
    defaultIcon = DEFAULT_ICON,
    className = "",
  } = props;

  if (!cities.length) {
    return (
      <p className="text-text-gray py-4 text-center text-sm">{emptyMessage}</p>
    );
  }

  const listClass = `flex max-h-72 flex-col gap-2 overflow-y-auto ps-0.5 ${className}`;

  if (props.multiple) {
    const selected = props.value;
    const toggle = (itemValue: string) =>
      props.onChange(
        selected.includes(itemValue)
          ? selected.filter((v) => v !== itemValue)
          : [...selected, itemValue],
      );

    return (
      <div className={listClass}>
        {cities.map((city) => (
          <OptionRow
            key={city.value}
            label={city.label}
            hint={city.hint}
            icon={city.icon ?? defaultIcon}
            selected={selected.includes(city.value)}
            onSelect={() => toggle(city.value)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={listClass}>
      {showAll && (
        <OptionRow
          label={allLabel}
          hint={allHint}
          selected={props.value === null}
          onSelect={() => props.onChange(null)}
        />
      )}
      {cities.map((city) => (
        <OptionRow
          key={city.value}
          label={city.label}
          hint={city.hint}
          icon={city.icon ?? defaultIcon}
          selected={props.value === city.value}
          onSelect={() => props.onChange(city.value)}
        />
      ))}
    </div>
  );
}
