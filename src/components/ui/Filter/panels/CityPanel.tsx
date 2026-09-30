"use client";

import { useMemo, useState, type ReactNode } from "react";
import { MapPin, Search, X } from "lucide-react";
import Accordion, { type AccordionItemData } from "../../Accordion";
import OptionRow from "../OptionRow";

export type CityPanelOption = {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
};

export type CityPanelGroup = {
  id: string;
  /** عنوان گروه — مثل «شمال» */
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
 * در حالت گروه‌بندی‌شده، هر گروه یک ردیف **آکاردئونی** است: با کلیک روی
 * عنوان منطقه، شهرهای همان منطقه باز می‌شود و منطقه‌ی قبلی بسته می‌شود
 * (تک‌باز). موقع جستجو، همه‌ی منطقه‌های دارای نتیجه خودکار باز می‌شوند تا
 * نتیجه داخل ردیف بسته پنهان نماند.
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

        <GroupAccordion
          groups={visibleGroups}
          term={term}
          isGroupActive={(group) =>
            group.options.some((option) => selected.includes(option.value))
          }
          renderGroup={(group) =>
            group.options.map((option) => (
              <OptionRow
                key={option.value}
                label={option.label}
                hint={option.hint}
                icon={option.icon ?? defaultIcon}
                selected={selected.includes(option.value)}
                onSelect={() => toggle(option.value)}
              />
            ))
          }
        />

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

      <GroupAccordion
        groups={visibleGroups}
        term={term}
        isGroupActive={(group) =>
          (group.allValue !== undefined && props.value === group.allValue) ||
          group.options.some((option) => props.value === option.value)
        }
        renderGroup={(group) => (
          <>
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
          </>
        )}
      />

      {isEmpty && <EmptyState message={emptyMessage} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * مناطق به‌صورت آکاردئون.
 *
 * دو حالت باز بودن:
 *   - مرور عادی: تک‌باز (`openId`) — با باز کردن یک منطقه، قبلی بسته می‌شود
 *   - جستجو: چندباز (`openIds`) — همه‌ی منطقه‌های دارای نتیجه خودکار بازند
 */
function GroupAccordion({
  groups,
  term,
  isGroupActive,
  renderGroup,
}: {
  groups: CityPanelGroup[];
  /** عبارت جستجوی فعلی — تعیین می‌کند حالت چندباز فعال شود یا نه */
  term: string;
  isGroupActive: (group: CityPanelGroup) => boolean;
  renderGroup: (group: CityPanelGroup) => ReactNode;
}) {
  const [browseOpenId, setBrowseOpenId] = useState<string | null>(null);

  const isSearching = term.length > 0;

  /** منطقه‌هایی که با عبارت جستجو نتیجه دارند */
  const matchingIds = useMemo(() => groups.map((group) => group.id), [groups]);

  /**
   * شناسه‌های باز در حالت جستجو.
   *
   * همگام‌سازی با «تنظیم state هنگام تغییر prop» انجام می‌شود (الگوی رسمی
   * React) تا نیازی به effect نباشد. وقتی کاربر عبارت را عوض کند، دوباره
   * همه‌ی نتیجه‌ها باز می‌شوند؛ ولی بستن دستی یک ردیف وسط جستجو باقی می‌ماند.
   */
  const [searchState, setSearchState] = useState<{
    term: string;
    openIds: string[];
  }>({ term: "", openIds: [] });

  if (searchState.term !== term) {
    setSearchState({ term, openIds: isSearching ? matchingIds : [] });
  }

  if (groups.length === 0) return null;

  const items: AccordionItemData[] = groups.map((group) => ({
    id: group.id,
    title: group.title,
    summary: group.hint,
    badge: group.options.length,
    active: isGroupActive(group),
    content: <div className="flex flex-col gap-2">{renderGroup(group)}</div>,
  }));

  if (isSearching) {
    return (
      <Accordion
        items={items}
        openIds={searchState.openIds}
        onToggleItem={(id, open) =>
          setSearchState((prev) => ({
            ...prev,
            openIds: open
              ? [...prev.openIds, id]
              : prev.openIds.filter((item) => item !== id),
          }))
        }
      />
    );
  }

  return (
    <Accordion
      items={items}
      openId={browseOpenId}
      onOpenChange={setBrowseOpenId}
    />
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
