"use client";

import { CalendarDays, MapPin, Search as SearchIcon, Users } from "lucide-react";

export default function Search() {
  return (
    <div className="hz-search mx-auto grid max-w-255 grid-cols-1 gap-2 rounded-2xl border border-white/15 bg-background/60 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl md:grid-cols-[1.15fr_1fr_1fr_0.8fr_auto] md:items-center md:gap-0 text-text">
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-text-gray"><MapPin size={14} />مقصد</div>
        <div className="text-sm">مثال: شمال ایران</div>
      </div>
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-text-gray"><CalendarDays size={14} />تاریخ ورود</div>
        <div className="text-sm">۱۴۰۴/۰۳/۲۵</div>
      </div>
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-text-gray"><CalendarDays size={14} />تاریخ خروج</div>
        <div className="text-sm">۱۴۰۴/۰۳/۲۸</div>
      </div>
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-text-gray"><Users size={14} />مهمان</div>
        <div className="text-sm">۲ نفر</div>
      </div>
      <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-400 px-6 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-primary-500">
        جستجو <SearchIcon size={18} />
      </button>
    </div>
  );
}
