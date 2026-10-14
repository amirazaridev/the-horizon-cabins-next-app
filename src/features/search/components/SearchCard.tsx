"use client";

import {
  MobileFilterBranch,
  Panel,
  Trigger,
  useFilterController,
  type FilterCardItem,
  type FilterCardValues,
} from "@/components/ui/Filter";
import { FOCUS_RING } from "@/components/ui/Filter/focus-ring";
import SearchMobileTrigger from "@/features/search/components/SearchMobileTrigger";

//* قاب تریگر موبایل سرچ (فقط ارتفاع/شکل — رنگ‌ها در `TRIGGER_TONE`)
const MOBILE_TRIGGER_BASE =
  "w-full rounded-full border shadow-sm transition-all duration-200 active:scale-[0.99] lg:shadow-xl";

//* ته‌رنگ تریگر موبایل به‌تفکیک واریانت — روی هیرو تیره، در `/cabins` روی سطح روشن
const TRIGGER_TONE = {
  hero: "border-white/15 bg-surface",
  results: "border-foreground/10 bg-surface shadow-black/5",
} as const;

type Props = {
  items: FilterCardItem[];
  values: FilterCardValues;
  onValueChange: (id: string, value: unknown) => void;
  //* پاک‌کردن پیش‌نویس — فقط داخل شیت موبایل
  onClearFilters: () => void;
  //* اعمال جستجو از دکمه‌ی شیت موبایل
  onApply: () => void;
  //* در حال اعمال — دکمه‌ی شیت spinner می‌گیرد
  isPending?: boolean;
  //* واریانت لندینگ — رنگ تریگر و متن‌های شیت از همین می‌آید
  isHero: boolean;
  mobileTitle: string;
  mobileApplyLabel: string;
  //* خلاصه‌ی خام (بدون متن جانشین) — برای تفکیک رنگ خط دوم تریگر
  mobileSummaryRaw: string;
  //* خلاصه‌ی نهایی تریگر (با متن جانشین)
  mobileSummary: string;
  className?: string;
};

export default function SearchCard({
  items,
  values,
  onValueChange,
  onClearFilters,
  onApply,
  isPending = false,
  isHero,
  mobileTitle,
  mobileApplyLabel,
  mobileSummaryRaw,
  mobileSummary,
  className = "",
}: Props) {
  const {
    //* دسکتاپ
    openId,
    toggle,
    close,
    openById,
    registerTrigger,
    panelDomId,
    anchorRect,
    triggerEl,
    //* موبایل
    sheetOpen,
    openSheet,
    closeSheet,
    mobileOpenId,
    setMobileOpenId,
    commitMobile,
    //* مقدار و شمارش
    getValue,
    setValue,
    activeCount,
    panelItems,
    actionItems,
  } = useFilterController({ items, value: values, onValueChange });

  //* «اعمال» سرچ دو کار می‌کند: جستجو را اجرا می‌کند و شیت را می‌بندد.
  const handleApply = () => {
    onApply();
    closeSheet();
  };

  const tone = isHero ? TRIGGER_TONE.hero : TRIGGER_TONE.results;

  return (
    <div className={className}>
      <div className="lg:hidden flex min-w-0 flex-1">
        <MobileFilterBranch
          triggerClass={`${MOBILE_TRIGGER_BASE} ${FOCUS_RING} ${tone}`}
          customTrigger={
            <SearchMobileTrigger
              isHero={isHero}
              summaryRaw={mobileSummaryRaw}
              summary={mobileSummary}
            />
          }
          triggerLabel={mobileTitle}
          activeCount={activeCount}
          actionItems={actionItems}
          sheetOpen={sheetOpen}
          openSheet={openSheet}
          closeSheet={closeSheet}
          sheetTitle={mobileTitle}
          onClearFilters={onClearFilters}
          onApply={handleApply}
          applyDisabled={false}
          applyPending={isPending}
          applyLabel={mobileApplyLabel}
          panelItems={panelItems}
          openPanelId={mobileOpenId}
          setOpenPanelId={setMobileOpenId}
          getValue={getValue}
          commitValue={commitMobile}
          setFieldValue={(id, next) => setValue(id, next, false)}
        />
      </div>

      <div className="hidden lg:contents">
        {items.map((item) => (
          <Trigger
            key={item.id}
            item={item}
            value={getValue(item.id)}
            isOpen={openId === item.id}
            toggle={toggle}
            close={close}
            register={registerTrigger}
            panelId={item.panel ? panelDomId(item.id) : undefined}
          />
        ))}
      </div>

      {items.map((item) =>
        item.panel ? (
          <Panel
            key={item.id}
            id={item.id}
            panel={item.panel}
            isOpen={openId === item.id}
            domId={panelDomId(item.id)}
            //* پنل‌های سرچ همیشه وسط‌چین باز می‌شوند (برخلاف فیلترهای داشبورد که از ابتدا باز می‌شوند).
            placement="center"
            getValue={getValue}
            setValue={setValue}
            openById={openById}
            close={close}
            anchorRect={anchorRect}
            triggerEl={triggerEl}
          />
        ) : null,
      )}
    </div>
  );
}
