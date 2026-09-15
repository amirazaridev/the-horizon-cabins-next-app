"use client";

import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import useDeleteCabin from "../hooks/useDeleteCabin";

export default function CabinDetailsActions({ cabinId }: { cabinId: number }) {
  const { handleConfirm, isModalOpen, setIsModalOpen } =
    useDeleteCabin(cabinId);

  return (
    <div className="flex gap-3">
      <Button
        href={`/dashboard/cabins/edit?cabinId=${cabinId}`}
        variant="primary"
        size="md"
        shape="xl"
        className="flex-1"
      >
        <Pencil className="size-4" />
        ویرایش
      </Button>

      {/* TODO: باز کردن مودال تایید حذف */}
      <Button
        variant="outline"
        size="md"
        shape="xl"
        className="text-danger! border-danger/40! hover:bg-danger/10! hover:text-danger! flex-1"
        onClick={() => setIsModalOpen(true)}
      >
        <Trash2 className="size-4" />
        حذف
      </Button>
    </div>
  );
}
