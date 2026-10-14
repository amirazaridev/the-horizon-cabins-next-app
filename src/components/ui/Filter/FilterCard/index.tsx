"use client";

import { useFilterController } from "../useFilterController";
import MobileFilterBranch from "./MobileFilterBranch";
import Panel from "./Panel";
import Trigger, { TRIGGER_VARIANTS } from "./Trigger";
import type { FilterCardProps } from "./types";

function FilterCard({
  items,
  value,
  defaultValue = {},
  onValueChange,
  placement = "start",
  defaultOpenId = null,
  className = "",
  mobileTitle = "فیلترها",
  mobileTriggerLabel = "فیلترها",
  mobileApplyLabel = "مشاهده نتایج",
  resultCount,
  onClearFilters,
}: FilterCardProps) {
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
  } = useFilterController({
    items,
    value,
    defaultValue,
    onValueChange,
    defaultOpenId,
  });

  //* تریگر پیش‌فرض موبایل — همان پیل؛ حالت فعالش با شمارش فیلترهای پر عوض می‌شود.
  const pill = TRIGGER_VARIANTS.pill;
  const triggerClass = `${pill.base} ${activeCount > 0 ? pill.active : pill.idle}`;

  return (
    <div className={className}>
      <div className="lg:hidden flex min-w-0 flex-1">
        <MobileFilterBranch
          triggerClass={triggerClass}
          customTrigger={undefined}
          triggerLabel={mobileTriggerLabel}
          activeCount={activeCount}
          actionItems={actionItems}
          sheetOpen={sheetOpen}
          openSheet={openSheet}
          closeSheet={closeSheet}
          sheetTitle={mobileTitle}
          onClearFilters={onClearFilters}
          //* این کارت «زنده» است: هر فیلد همان لحظه ثبت می‌شود، پس «اعمال» فقط شیت را می‌بندد.
          onApply={closeSheet}
          applyDisabled={false}
          applyPending={false}
          applyLabel={mobileApplyLabel}
          resultCount={resultCount}
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
            placement={placement}
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

export default FilterCard;

export type {
  FilterCardValues,
  FilterCardPlacement,
  FilterTriggerVariant,
  FilterPanelSize,
  TriggerRenderProps,
  PanelRenderProps,
  FilterPanelConfig,
  FilterCardItem,
  FilterCardProps,
} from "./types";
