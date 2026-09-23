import Spinner from "@/components/ui/Spinner";
import { type ReactNode } from "react";

export default function loading(): ReactNode {
  return (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}
