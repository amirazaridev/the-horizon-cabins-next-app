import {
  Building2,
  Castle,
  Home,
  Hotel,
  House,
  MountainSnow,
  Sparkles,
  Trees,
  Waves,
  WavesLadder,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Home,
  Building2,
  Hotel,
  Castle,
  Trees,
  Sparkles,
  MountainSnow,
  Waves,
  WavesLadder,
  House,
};

export function getCategoryIcon(name: string): LucideIcon {
  const icon = CATEGORY_ICONS[name];

  if (!icon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[category-icons] آیکن ناشناخته «${name}» — آیکن پیش‌فرض Home استفاده شد.`,
      );
    }
    return Home;
  }

  return icon;
}
