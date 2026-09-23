import Spinner from "@/components/ui/spinner";
import { type ReactNode } from "react";

export default function loading(): ReactNode {
  return <Spinner fullscreen />;
}
