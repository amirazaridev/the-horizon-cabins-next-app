"use client";

import { CalendarDays, MapPin, Search, Users } from "lucide-react";

export default function HorizonSearch() {
  return (
    <div className="hz-search mx-auto grid max-w-[1020px] grid-cols-1 gap-2 rounded-2xl border border-white/15 bg-[#0a1524]/72 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl md:grid-cols-[1.15fr_1fr_1fr_0.8fr_auto] md:items-center md:gap-0">
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-white/45"><MapPin size={14} />مقصد</div>
        <div className="text-sm text-white/85">مثال: شمال ایران</div>
      </div>
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-white/45"><CalendarDays size={14} />تاریخ ورود</div>
        <div className="text-sm text-white/85">۱۴۰۴/۰۳/۲۵</div>
      </div>
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-white/45"><CalendarDays size={14} />تاریخ خروج</div>
        <div className="text-sm text-white/85">۱۴۰۴/۰۳/۲۸</div>
      </div>
      <div className="px-4 py-3 text-right md:border-l md:border-white/10">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-white/45"><Users size={14} />مهمان</div>
        <div className="text-sm text-white/85">۲ نفر</div>
      </div>
      <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f2b229] px-6 text-sm font-bold text-[#101721] transition hover:-translate-y-0.5 hover:bg-[#ffc64e]">
        جستجو <Search size={18} />
      </button>
    </div>
  );
}
