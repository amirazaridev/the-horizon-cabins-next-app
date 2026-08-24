import { LandingOption } from "@/types/landing-option";
import { Balloon, Earth, Heart, Sparkle } from "lucide-react";

export const ABOUT_FEATURES: LandingOption[] = [
  {
    id: 1,
    title: "پریمیوم",
    parag: "امکانات لوکس",
    icon: <Sparkle />,
  },
  {
    id: 2,
    title: "دیدنی",
    parag: "منظره کوهستان",
    icon: <Earth />,
  },
  {
    id: 3,
    title: "آرامش",
    parag: "فضای ساکت برای استراحت",
    icon: <Heart />,
  },
  {
    id: 4,
    title: "تفریحات",
    parag: "سرگرمی در تمام فصول",
    icon: <Balloon />,
  },
];
