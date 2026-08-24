import Spinner from "@/components/ui/Spinner";
import { type ReactNode } from "react";

export default function loading(): ReactNode {
  return (
    <div className="w-full py-20">
      <Spinner fullWidth />
    </div>
  );
}
