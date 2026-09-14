"use client";

import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Menus from "@/components/ui/Menus";

interface CabinCardMenuProps {
  cabinId: number;
}

export default function CabinCardMenu({ cabinId }: CabinCardMenuProps) {
  const router = useRouter();
  const menuId = `cabin-menu-${cabinId}`;

  return (
    <Menus>
      <Menus.Toggle id={menuId} icon={<MoreVertical className="size-5" />} />
      <Menus.List id={menuId}>
        <Menus.Button
          icon={<Eye />}
          onClick={() => router.push(`/dashboard/cabins/${cabinId}`)}
        >
          مشاهده جزئیات کامل
        </Menus.Button>

        <Menus.Button icon={<Pencil />} onClick={() => router.push(`/dashboard/cabins/edit?cabinId=${cabinId}`)}>
          ویرایش
        </Menus.Button>

        <Menus.Divider />

        {/* TODO: باز کردن مودال تایید حذف */}
        <Menus.Button icon={<Trash2 />} danger onClick={() => {}}>
          حذف
        </Menus.Button>
      </Menus.List>
    </Menus>
  );
}