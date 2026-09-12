"use client";

import { CalendarDays } from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// import "react-multi-date-picker/styles/colors/amber.css";
import "react-multi-date-picker/styles/colors/teal.css"

interface DateRangeFilterProps {
  from: Date;
  to: Date;
  onChange: (from: Date, to: Date) => void;
}

export default function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const value = [
    new DateObject({ date: from, calendar: persian, locale: persian_fa }),
    new DateObject({ date: to, calendar: persian, locale: persian_fa }),
  ];

  function handleChange(dates: DateObject | DateObject[] | null) {
    if (!Array.isArray(dates) || !dates[0] || !dates[1]) return;
    onChange(dates[0].toDate(), dates[1].toDate());
  }

  return (
    <div className="relative w-full md:w-auto">
      <CalendarDays className="text-text-gray pointer-events-none absolute top-1/2 right-3 z-10 size-4.5 -translate-y-1/2" />
      <DatePicker
        value={value}
        onChange={handleChange}
        range
        calendar={persian}
        locale={persian_fa}
        format="DD MMMM YYYY"
        placeholder="انتخاب بازه تاریخ"
        containerClassName="w-full md:w-auto"
        inputClass="bg-surface border-border text-text hover:border-border-strong focus:border-primary-400/60 w-full cursor-pointer rounded-xl border py-2.5 pr-10 pl-4 text-sm transition-colors focus:outline-none md:w-66"
      />
    </div>
  );
}