import {
  CalendarX,
  Check,
  Clock,
  CreditCard,
  Info,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import CardContainer from "@/components/ui/CardContainer";
import { CABIN_RULES, SECTION_IDS } from "../../constants/cabin-detail";
import type { CabinRuleItem } from "../../types/cabin-detail.types";
import SectionShell from "./SectionShell";

type BlockProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
};

function RuleBlock({ icon: Icon, title, children, className = "" }: BlockProps) {
  return (
    <CardContainer className={`shadow-md ${className}`}>
      <h3 className="text-text mb-4 flex items-center gap-2.5 font-bold">
        <span className="bg-primary-400/10 grid size-9 shrink-0 place-items-center rounded-xl">
          <Icon className="text-primary-400 size-4.5" aria-hidden="true" />
        </span>
        {title}
      </h3>
      {children}
    </CardContainer>
  );
}

function RuleList({ items }: { items: CabinRuleItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <Check
            className="text-primary-400 mt-1 size-4 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="text-text text-sm font-bold">{item.title}</p>
            <p className="text-text-gray mt-1 text-xs leading-relaxed">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * قوانین و مقررات.
 *
 * ⚠️ منبع داده `CABIN_RULES` است (ماک تایپ‌شده و مشترک بین همه‌ی
 * کابین‌ها). بک‌اند فعلاً قوانین ندارد؛ با اضافه‌شدن فیلد `rules` در پاسخ
 * کابین، فقط همین یک import عوض می‌شود.
 *
 * این سکشن سروری است و هیچ state ندارد، پس در HTML اولیه رندر می‌شود.
 */
export default function RulesSection(): ReactNode {
  return (
    <SectionShell
      id={SECTION_IDS.rules}
      title="قوانین و مقررات"
      hint="پیش از رزرو، این موارد را یک بار مرور کنید"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <RuleBlock icon={Clock} title="ساعت ورود و خروج">
          <div className="grid grid-cols-2 gap-3">
            <div className="border-foreground/10 bg-background-2 rounded-2xl border px-4 py-3">
              <p className="text-text-gray text-xs">ورود</p>
              <p className="text-text mt-1 text-sm font-bold">
                {CABIN_RULES.checkIn}
              </p>
            </div>
            <div className="border-foreground/10 bg-background-2 rounded-2xl border px-4 py-3">
              <p className="text-text-gray text-xs">خروج</p>
              <p className="text-text mt-1 text-sm font-bold">
                {CABIN_RULES.checkOut}
              </p>
            </div>
          </div>

          <p className="text-text-gray mt-4 text-xs leading-relaxed">
            ورود پیش از ساعت اعلام‌شده فقط با هماهنگی قبلی میزبان امکان‌پذیر
            است. تحویل کلید در زمان خروج انجام می‌شود.
          </p>
        </RuleBlock>

        <RuleBlock icon={CreditCard} title="مدارک موردنیاز">
          <RuleList items={CABIN_RULES.documents} />
        </RuleBlock>

        <RuleBlock icon={CalendarX} title="مقررات لغو رزرو" className="md:col-span-2">
          <RuleList items={CABIN_RULES.cancellation} />
        </RuleBlock>

        <RuleBlock icon={Info} title="سایر قوانین اقامتگاه" className="md:col-span-2">
          <RuleList items={CABIN_RULES.general} />
        </RuleBlock>
      </div>
    </SectionShell>
  );
}
