import type { ReactNode } from "react";
import OptionRow from "./OptionRow";
import SelectedChips, { type SelectedChipItem } from "./SelectedChips";

export type MultiOptionListOption = {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
};

type MultiOptionListProps = {
  options: MultiOptionListOption[];
  /** مقدارهای انتخاب‌شده فعلی */
  value: string[];
  onChange: (next: string[]) => void;
};

/**
 * لیست گزینه‌های چندانتخابی برای استفاده داخل پنل FilterCard.
 * آیتم‌های انتخاب‌شده به‌صورت چیپ (با دکمه حذف) در بالای لیست نشان داده می‌شوند.
 */
export default function MultiOptionList({
  options,
  value,
  onChange,
}: MultiOptionListProps) {
  const selectedItems: SelectedChipItem[] = value
    .map((v) => options.find((option) => option.value === v))
    .filter((option): option is MultiOptionListOption => Boolean(option))
    .map((option) => ({
      value: option.value,
      label: option.label,
      icon: option.icon,
    }));

  function toggle(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );
  }

  function remove(optionValue: string) {
    onChange(value.filter((v) => v !== optionValue));
  }

  return (
    <div className="flex flex-col gap-3">
      <SelectedChips items={selectedItems} onRemove={remove} />
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <OptionRow
            key={option.value}
            label={option.label}
            hint={option.hint}
            icon={option.icon}
            selected={value.includes(option.value)}
            onSelect={() => toggle(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
