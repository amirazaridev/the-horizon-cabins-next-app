"use client";

import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CabinDetailsActions(_props: { cabinId: number }) {
  return (
    <div className="flex gap-3">
      <Button
        href={`/dashboard/cabins/edit?cabinId=${_props.cabinId}`}
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
      >
        <Trash2 className="size-4" />
        حذف
      </Button>
    </div>
  );
}
