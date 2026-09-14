import Button from "@/components/ui/Button";
import { type ReactNode } from "react";

export default function AddCabin(): ReactNode {
  return (
    <Button size="md" href="/dashboard/cabins/add">
      اضافه کردن سوییت
    </Button>
  );
}
