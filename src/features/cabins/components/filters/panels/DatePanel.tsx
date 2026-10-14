"use client";

import { useState } from "react";
import DateRangePanel, {
  type DateRange,
} from "@/components/ui/Filter/panels/DateRangePanel";
import {
  formatDateParam,
  parseDateParam,
  type CabinDateValue,
} from "../../../utils/cabin-date";
import { useCabinQuery } from "../useCabinQuery";

type Props = {
  value?: CabinDateValue;
  onChange?: (next: CabinDateValue) => void;
  /** بعد از کامل شدن بازه (انتخاب خروج) صدا زده می‌شود — معمولاً بستن پنل */
  onDone?: () => void;
};

function toRange(value: CabinDateValue): DateRange {
  return {
    from: parseDateParam(value.checkIn),
    to: parseDateParam(value.checkOut),
  };
}

export default function DatePanel({ value, onChange, onDone }: Props) {
  const { searchParams, setParams } = useCabinQuery();

  const external: CabinDateValue = value ?? {
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
  };

  const commit = (next: CabinDateValue) => {
    if (onChange) onChange(next);
    else setParams({ checkIn: next.checkIn, checkOut: next.checkOut });
  };

  const [draft, setDraft] = useState<DateRange>(() => toRange(external));
  const [lastSynced, setLastSynced] = useState(external);
  if (
    external.checkIn !== lastSynced.checkIn ||
    external.checkOut !== lastSynced.checkOut
  ) {
    setLastSynced(external);
    setDraft(toRange(external));
  }

  const handleChange = (range: DateRange) => {
    setDraft(range);
    commit({
      checkIn: range.from ? formatDateParam(range.from) : null,
      checkOut: range.to ? formatDateParam(range.to) : null,
    });
  };

  const clear = () => {
    setDraft({ from: null, to: null });
    commit({ checkIn: null, checkOut: null });
  };

  return (
    <DateRangePanel
      value={draft}
      onChange={handleChange}
      onComplete={onDone}
      showClear
      onClear={clear}
    />
  );
}
