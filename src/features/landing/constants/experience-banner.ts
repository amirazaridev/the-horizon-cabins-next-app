import { ShieldCheck, Sparkles, Star, type LucideIcon } from "lucide-react";

// * سه مزیت سکشن «چرا هورایزن؟».
export type ExperienceBannerItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  iconClassName: string;
};

export const EXPERIENCE_BANNER_ITEMS: ExperienceBannerItem[] = [
  {
    icon: ShieldCheck,
    title: "رزرو مطمئن",
    desc: "پرداخت امن و پشتیبانی واقعی",
    iconClassName: "text-secondary-400",
  },
  {
    icon: Star,
    title: "اقامتگاه‌های منتخب",
    desc: "کیفیت بررسی‌شده و مطمئن",
    iconClassName: "text-primary-400",
  },
  {
    icon: Sparkles,
    title: "تجربه‌های متفاوت",
    desc: "هر مقصد، یک خاطره تازه",
    iconClassName: "text-primary-400",
  },
];
