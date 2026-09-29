"use client";

import { useMemo, useState, type ReactNode } from "react";
import { MapPin, Search, X } from "lucide-react";
import OptionRow from "../OptionRow";

export type CityPanelOption = {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
};

export type CityPanelGroup = {
  id: string;
  /** عنوان گروه — مثل «شمال ایران» */
  title: string;
  /** توضیح کوچک کنار عنوان */
  hint?: string;
  /** اگر مقدار داشته باشد، خودِ عنوان گروه هم قابل انتخاب است («همه شهرهای شمال») */
  allValue?: string;
  allLabel?: string;
  options: CityPanelOption[];
};

type CityPanelCommonProps = {
  /** لیست تخت گزینه‌ها */
  cities?: CityPanelOption[];
  /** لیست گروه‌بندی‌شده (مثل گروه‌بندی بر اساس منطقه) */
  groups?: CityPanelGroup[];
  /** نمایش سطر «همه شهرها» در حالت تخت */
  showAll?: boolean;
  allLabel?: string;
  allHint?: string;
  emptyMessage?: string;
  defaultIcon?: ReactNode;
  className?: string;
  /** نمایش کادر جستجوی کوچک بالای لیست (فیلتر سمت کلاینت، بدون درخواست) */
  searchable?: boolean;
  searchPlaceholder?: string;
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

const DEFAULT_ICON = <MapPin className="text-primary-400 size-4 shrink-0" />;

/**
 * پنل انتخاب مقصد — reusable برای همه‌جا (landing، cabins، dashboard).
 *
 * دو حالت داده:
 *   - تخت (`cities`) با اختیار «همه شهرها»
 *   - گروه‌بندی‌شده (`groups`) با اختیار «همه شهرهای …» برای هر گروه
 *
 * مقدار در حالت تکی `string | null` و در حالت چندتایی `string[]` است.
 * کنترل کامل با والد است (داخل FilterCard یا هر جای دیگر).
 */
export default function CityPanel(props: CityPanelProps) {
  const {
    cities = [],
    groups = [],
    showAll = false,
    allLabel = "همه شهرها",
    allHint,
    emptyMessage = "مقصدی برای نمایش نیست.",
    defaultIcon = DEFAULT_ICON,
    className = "",
    searchable = false,
    searchPlaceholder = "جستجوی شهر یا منطقه…",
  } = props;

  const [query, setQuery] = useState("");
  const term = query.trim();

  const visibleGroups = useMemo(() => {
    if (!term) return groups;
    return groups
      .map((group) =>
        group.title.includes(term)
          ? group
          : {
              ...group,
              options: group.options.filter((option) =>
                option.label.includes(term),
              ),
            },
      )
      .filter((group) => group.options.length > 0);
  }, [groups, term]);

  const visibleCities = useMemo(
    () => (term ? cities.filter((city) => city.label.includes(term)) : cities),
    [cities, term],
  );

  const isEmpty =
    visibleGroups.length === 0 && visibleCities.length === 0 && !showAll;

  const listClass = `flex flex-col gap-2 ${className}`;

  /* ------------------------- حالت چندتایی ------------------------- */
  if (props.multiple) {
    const selected = props.value;
    const toggle = (itemValue: string) =>
      props.onChange(
        selected.includes(itemValue)
          ? selected.filter((value) => value !== itemValue)
          : [...selected, itemValue],
      );

    return (
      <div className={listClass}>
        {searchable && (
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder={searchPlaceholder}
          />
        )}

        {visibleCities.map((city) => (
          <OptionRow
            key={city.value}
            label={city.label}
            hint={city.hint}
            icon={city.icon ?? defaultIcon}
            selected={selected.includes(city.value)}
            onSelect={() => toggle(city.value)}
          />
        ))}

        {visibleGroups.map((group) => (
          <GroupSection key={group.id} group={group}>
            {(group.options ?? []).map((option) => (
              <OptionRow
                key={option.value}
                label={option.label}
                hint={option.hint}
                icon={option.icon ?? defaultIcon}
                selected={selected.includes(option.value)}
                onSelect={() => toggle(option.value)}
              />
            ))}
          </GroupSection>
        ))}

        {isEmpty && <EmptyState message={emptyMessage} />}
      </div>
    );
  }

  /* -------------------------- حالت تک‌تایی -------------------------- */
  const select = (next: string | null) => props.onChange(next);

  return (
    <div className={listClass}>
      {searchable && (
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder={searchPlaceholder}
        />
      )}

      {showAll && !term && (
        <OptionRow
          label={allLabel}
          hint={allHint}
          selected={props.value === null}
          onSelect={() => select(null)}
        />
      )}

      {visibleCities.map((city) => (
        <OptionRow
          key={city.value}
          label={city.label}
          hint={city.hint}
          icon={city.icon ?? defaultIcon}
          selected={props.value === city.value}
          onSelect={() => select(city.value)}
        />
      ))}

      {visibleGroups.map((group) => (
        <GroupSection key={group.id} group={group}>
          {group.allValue && (
            <OptionRow
              label={group.allLabel ?? `همه ${group.title}`}
              selected={props.value === group.allValue}
              onSelect={() => select(group.allValue!)}
            />
          )}
          {group.options.map((option) => (
            <OptionRow
              key={option.value}
              label={option.label}
              hint={option.hint}
              icon={option.icon ?? defaultIcon}
              selected={props.value === option.value}
              onSelect={() => select(option.value)}
            />
          ))}
        </GroupSection>
      ))}

      {isEmpty && <EmptyState message={emptyMessage} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function GroupSection({
  group,
  children,
}: {
  group: CityPanelGroup;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="text-text-gray flex items-center gap-1 px-1 text-xs font-bold tracking-wide">
        {group.title}
        {group.hint && (
          <span className="text-text-gray/70 font-medium">· {group.hint}</span>
        )}
      </h4>
      {children}
    </section>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  return (
    <label className="border-foreground/10 bg-background-2 focus-within:border-primary-400 sticky top-0 z-10 flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors">
      <Search className="text-text-gray size-4 shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="text-text placeholder:text-text-gray/70 min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن جستجو"
          className="text-text-gray hover:text-text grid size-6 shrink-0 place-items-center rounded-full transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
    </label>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-text-gray py-6 text-center text-sm">{message}</p>
  );
}
