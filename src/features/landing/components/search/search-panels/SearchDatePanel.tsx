"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import RangeDatePicker, {
  type DateRange,
} from "@/components/ui/RangeDatePicker";

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onComplete: () => void;
};

/** کارت تاریخ ورود/خروج — یک تقویم دوقلوی شمسی که هر دو فیلد را پر می‌کند */
export default function SearchDatePanel({ value, onChange, onComplete }: Props) {
  const isNarrow = useMediaQuery("(max-width: 640px)");

  return (
    <RangeDatePicker
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      numberOfMonths={isNarrow ? 1 : 2}
    />
  );
}
