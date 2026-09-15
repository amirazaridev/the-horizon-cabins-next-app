"use client";

import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Menus from "@/components/ui/Menus";
import ConfirmModal from "@/components/ui/ConfirmModal";
import useDeleteCabin from "../hooks/useDeleteCabin";

interface CabinCardMenuProps {
  cabinId: number;
  cabinName?: string;
}

export default function CabinCardMenu({
  cabinId,
  cabinName,
}: CabinCardMenuProps) {
  const {handleConfirm,isModalOpen,setIsModalOpen} = useDeleteCabin(cabinId);
  const router = useRouter();
  const menuId = `cabin-menu-${cabinId}`;

  return (
    <>
      <Menus>
        <Menus.Toggle id={menuId} icon={<MoreVertical className="size-5" />} />
        <Menus.List id={menuId}>
          <Menus.Button
            icon={<Eye />}
            onClick={() => router.push(`/dashboard/cabins/${cabinId}`)}
          >
            مشاهده جزئیات کامل
          </Menus.Button>

          <Menus.Button
            icon={<Pencil />}
            onClick={() =>
              router.push(`/dashboard/cabins/edit?cabinId=${cabinId}`)
            }
          >
            ویرایش
          </Menus.Button>

          <Menus.Divider />

          <Menus.Button
            icon={<Trash2 />}
            danger
            onClick={() => setIsModalOpen(true)}
          >
            حذف
          </Menus.Button>
        </Menus.List>
      </Menus>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="حذف سوییت"
        description={
          cabinName
            ? `آیا از حذف «${cabinName}» مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`
            : "آیا از حذف این سوییت مطمئن هستید؟ این عملیات غیرقابل بازگشت است."
        }
        confirmText="بله، حذف کن"
        variant="danger"
      />
    </>
  );
}
