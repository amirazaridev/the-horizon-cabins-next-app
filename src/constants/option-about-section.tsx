import { TOption } from "@/types/TOptionLandingPage";
import { Balloon, Earth, Heart, Sparkle } from "lucide-react";

export const OPTIONS_ABOUT : TOption[] = [
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