import { CalendarDays, MapPin, Users, Wallet } from "lucide-react";

import type { FilterCardItem } from "@/components/ui/Filter/FilterCard";
import DateRangePanel, {
  type DateRange,
} from "@/components/ui/Filter/panels/DateRangePanel";
import { formatJalaliDate } from "@/components/ui/RangeDatePicker";
import type { City } from "@/features/cabins/types/city.types";
import BudgetPanel from "@/features/search/components/fields/BudgetPanel";
import FieldContent from "@/features/search/components/fields/FieldContent";
import GuestsPanel from "@/features/search/components/fields/GuestsPanel";
import DestinationPanel from "@/features/search/components/destination/DestinationPanel";
import type {
  BudgetRange,
  Destination,
  Region,
} from "@/features/search/types/search.types";
import {
  budgetFieldLabel,
  destinationLabel,
  formatBudgetRangeLabel,
  formatBudgetRangeLabelCompact,
} from "@/features/search/utils/search-summary";
import { todayInTehran } from "@/libs/utils/tehran-date";

export type SearchFieldsContext = {
  cities: City[];
  //* مناطق واقعی از API — برای گروه‌بندی شهرها در پنل مقصد
  regions: Region[];
  //* تعداد شب بازه‌ی در حال ویرایش — مبنای «حالت بودجه» (هر شب / کل سفر)
  draftNights: number;
  //* خلاصه‌ی تاریخ برای برچسب فیلد ورود در موبایل
  mobileDateSummary: string | null;
  //* کلاس جداکننده‌ی عمودی بین فیلدها (رنگش بین hero و results فرق دارد)
  divider: string;
  //* افق رزرو (روز) — سقف تقویم
  bookingWindowDays: number;
  //* اعمال اتمیک بودجه: مقدار تازه را ثبت می‌کند و جستجو را همان لحظه اجرا می‌کند
  onApplyBudget: (budget: BudgetRange | null) => void;
  //* فقط در لندینگ `true` است: «اعمال» باید همیشه جستجوی واقعی بسازد، حتی وقتی نتیجه روی مرز بازه افتاده. در `/cabins` بازه‌ی کامل `null` می‌ماند تا URL پارامتر بی‌مورد نگیرد.
  commitFullRange: boolean;
};

//* کارت مشترک تاریخ ورود/خروج — یک تقویم دوقلو که هر دو فیلد را پر می‌کند.
function datePanel(ctx: SearchFieldsContext): FilterCardItem["panel"] {
  const { bookingWindowDays } = ctx;

  return {
    title: "تاریخ سفر",
    size: "xl",
    placement: "center",
    render: ({ getValue, setFieldValue, close, openPanel }) => {
      const range: DateRange = {
        from: (getValue("checkIn") as Date | null) ?? null,
        to: (getValue("checkOut") as Date | null) ?? null,
      };
      //* کمینه‌ی تقویم = «امروز» به وقت تهران (نه ساعت مرورگر)، چون بک‌اند تاریخ گذشته‌ی تهران را با ۴۰۰ رد می‌کند.
      const today = todayInTehran();
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + bookingWindowDays);

      return (
        <DateRangePanel
          value={range}
          minDate={today}
          maxDate={maxDate}
          onChange={(next) => {
            setFieldValue("checkIn", next.from);
            setFieldValue("checkOut", next.to);
          }}
          onComplete={() => {
            close();
            openPanel("guests");
          }}
        />
      );
    },
  };
}

export function buildSearchFieldItems(
  ctx: SearchFieldsContext,
): FilterCardItem[] {
  const {
    cities,
    regions,
    draftNights,
    mobileDateSummary,
    divider,
    onApplyBudget,
    commitFullRange,
  } = ctx;

  return [
    {
      id: "destination",
      label: "مثال: شمال ایران",
      variant: "field",
      formatLabel: (value) =>
        destinationLabel(value as Destination | null, cities),
      className: "md:rounded-none",
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<MapPin className="size-4" />}
          label="مقصد"
          value={destinationLabel(value as Destination | null, cities)}
          placeholder="مثال: شمال ایران"
          caret
        />
      ),
      panel: {
        title: "کجا می‌خواهید بروید؟",
        size: "md",
        placement: "center",
        closeOnSelect: true,
        advanceTo: "checkIn",
        render: ({ value, setValue }) => (
          <DestinationPanel
            cities={cities}
            regions={regions}
            value={(value as Destination | null) ?? null}
            onChange={(next) => setValue(next)}
          />
        ),
      },
    },
    {
      id: "checkIn",
      label: "تاریخ ورود",
      variant: "field",
      //* ورود و خروج یک فیلتر حساب می‌شوند
      group: "dates",
      formatLabel: () => mobileDateSummary ?? undefined,
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<CalendarDays className="size-4" />}
          label="تاریخ ورود"
          value={formatJalaliDate(value as Date | null)}
          placeholder="افزودن تاریخ"
        />
      ),
      panel: datePanel(ctx),
    },
    {
      id: "checkOut",
      label: "تاریخ خروج",
      variant: "field",
      group: "dates",
      hideOnMobile: true,
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<CalendarDays className="size-4" />}
          label="تاریخ خروج"
          value={formatJalaliDate(value as Date | null)}
          placeholder="افزودن تاریخ"
        />
      ),
      panel: datePanel(ctx),
    },
    {
      id: "guests",
      label: "تعداد مهمان",
      variant: "field",
      formatLabel: (value) =>
        typeof value === "number" && value >= 1
          ? `${value.toLocaleString("fa-IR")} مهمان`
          : undefined,
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<Users className="size-4" />}
          label="مهمان"
          value={
            typeof value === "number"
              ? `${value.toLocaleString("fa-IR")} نفر`
              : undefined
          }
          placeholder="تعداد مهمان"
        />
      ),
      panel: {
        title: "تعداد مهمان",
        size: "md",
        placement: "end",
        //* بعد از تأیید مهمان، پنل بودجه خودکار باز می‌شود — ادامه‌ی زنجیره‌ای که پنل تاریخ با `advanceTo: "checkIn"` شروع می‌کند.
        render: ({ value, setValue, openPanel }) => (
          <GuestsPanel
            value={typeof value === "number" ? value : null}
            onChange={setValue}
            onDone={() => openPanel("budget")}
          />
        ),
      },
    },
    {
      id: "budget",
      //* برچسب/عنوان بسته به وجود تاریخ عوض می‌شود: «هر شب» یا «کل سفر»
      label: budgetFieldLabel(draftNights),
      variant: "field",
      formatLabel: (value) =>
        formatBudgetRangeLabel(value as BudgetRange | null, draftNights),
      className: `md:rounded-none md:border-s ${divider}`,
      renderTrigger: ({ value }) => (
        <FieldContent
          icon={<Wallet className="size-4" />}
          label={budgetFieldLabel(draftNights)}
          value={formatBudgetRangeLabelCompact(
            value as BudgetRange | null,
            draftNights,
          )}
          placeholder="بازه‌ی بودجه"
          caret
        />
      ),
      panel: {
        title: budgetFieldLabel(draftNights),
        size: "md",
        placement: "end",
        //* «اعمال» بودجه فقط مقدار را ثبت نمی‌کند؛ جستجو را هم همان لحظه اجرا می‌کند. مقدار تازه با `patch` می‌رود تا روی کنترلر URL (که draft را در state نگه می‌دارد) مقدار کهنه ثبت نشود. «حذف بودجه» این مسیر را طی نمی‌کند.
        render: ({ value, setValue, close }) => (
          <BudgetPanel
            value={(value as BudgetRange | null) ?? null}
            onChange={(next) => setValue(next)}
            onDone={close}
            onApply={onApplyBudget}
            commitFullRange={commitFullRange}
            nights={draftNights}
          />
        ),
      },
    },
  ];
}
