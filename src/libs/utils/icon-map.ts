import {
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
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
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

export function getIconByName(name: string): LucideIcon {
  return iconMap[name] ?? Home;
}
