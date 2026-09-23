import { BookText, Hotel, LayoutGrid, Users } from "lucide-react";

export const SIDEBAR_ITEMS = [
  { name: "داشبورد", href: "/dashboard", icon: LayoutGrid },
  { name: "سوییت ها", href: "/dashboard/cabins", icon: Hotel },
  { name: "افراد و مهمانان", href: "/dashboard/users", icon: Users },
  { name: "رزرو ها", href: "/dashboard/bookings", icon: BookText },
];
